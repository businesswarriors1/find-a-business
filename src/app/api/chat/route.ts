import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/admin";
import { sendNewListingAlert } from "@/lib/slack";

const CLAUDE_SYSTEM_PROMPT = `You are a friendly business intake assistant for Find a Business (findabusiness.com.au), a free Australian business directory. Your job is to warmly collect the following information from users who want to list their Australian business:

Required fields:
- Business name
- Category (type of business, e.g. Plumber, Cafe, Electrician, Dentist)
- Suburb and State (Australian location)

Optional but helpful:
- Phone number
- Website
- Description of the business
- Contact name
- Contact email

Guidelines:
- Be conversational and friendly — you're helping a real business owner
- Collect information one or two fields at a time
- If the user provides multiple pieces of info at once, acknowledge them all
- Confirm the collected information before finalizing
- When you have at least the business name, category, suburb, and state, ask if they want to submit
- Australian suburb and state validation: states are NSW, VIC, QLD, WA, SA, TAS, NT, ACT

When the user is ready to submit, respond with JSON wrapped in \`\`\`json...\`\`\` that contains:
{
  "ready_to_submit": true,
  "business_name": "...",
  "category": "...",
  "suburb": "...",
  "state": "...",
  "phone": "...",
  "website": "...",
  "description": "...",
  "contact_name": "...",
  "contact_email": "..."
}`;

export async function POST(request: NextRequest) {
  try {
    // IP extraction
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

    // Rate limit: 5 per IP per hour
    const rateLimit = await checkRateLimit(`chat:${ip}`, 5, "1 h");
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const messages = body.messages as { role: string; content: string }[] | undefined;

    // Honeypot check
    if (body.honeypot_field) {
      return NextResponse.json({ message: "Message received" }, { status: 200 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Call Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 },
      );
    }

    // Anthropic requires `system` as a top-level parameter — NOT a message with
    // role "system". Only "user"/"assistant" roles are valid in `messages`.
    const apiMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    // Model is overridable via env so it can be upgraded without a code change.
    const model = process.env.CHAT_MODEL ?? "claude-3-5-haiku-latest";

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: CLAUDE_SYSTEM_PROMPT,
        messages: apiMessages,
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error("Claude API error:", errText);
      return NextResponse.json(
        { error: "AI service error. Please try again later." },
        { status: 502 },
      );
    }

    const claudeData = await claudeRes.json();
    const assistantMessage = claudeData.content?.[0]?.text ?? "";

    // Check if response contains submission JSON
    const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const submission = JSON.parse(jsonMatch[1]);
        if (submission.ready_to_submit && submission.business_name) {
          const supabase = createClient();
          const { error: insertError } = await supabase.from("listing_requests").insert({
            business_name: submission.business_name,
            category: submission.category ?? null,
            suburb: submission.suburb ?? null,
            state: submission.state ?? null,
            phone: submission.phone ?? null,
            website: submission.website ?? null,
            description: submission.description ?? null,
            contact_name: submission.contact_name ?? null,
            contact_email: submission.contact_email ?? null,
            chat_transcript: JSON.stringify(messages),
            ip_address: ip,
            status: "pending",
            source: "chat",
          });

          if (insertError) {
            console.error("Insert error:", insertError);
          }

          // Send Slack notification
          await sendNewListingAlert({
            business_name: submission.business_name,
            category: submission.category,
            suburb: submission.suburb,
            state: submission.state,
            contact_name: submission.contact_name,
            contact_email: submission.contact_email,
          }).catch((e) => console.error("Slack error:", e));

          return NextResponse.json({
            message: assistantMessage,
            submitted: true,
          });
        }
      } catch (parseErr) {
        console.error("JSON parse error from Claude response:", parseErr);
      }
    }

    return NextResponse.json({ message: assistantMessage, submitted: false });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
