const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function postToSlack(message: Record<string, unknown>) {
  if (!SLACK_WEBHOOK_URL) {
    console.log("[SLACK MOCK]", JSON.stringify(message, null, 2));
    return { ok: true, mock: true };
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    console.error("Slack webhook failed:", await res.text());
  }
  return res.ok ? { ok: true } : { ok: false };
}

export async function sendSlackAlert(text: string) {
  return postToSlack({ text });
}

export async function sendNewListingAlert(requestData: {
  business_name: string;
  category?: string;
  suburb?: string;
  state?: string;
  contact_name?: string;
  contact_email?: string;
}) {
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "📝 New Listing Request" },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Business:*\n${requestData.business_name}` },
        { type: "mrkdwn", text: `*Category:*\n${requestData.category ?? "N/A"}` },
        { type: "mrkdwn", text: `*Location:*\n${requestData.suburb ?? "N/A"}, ${requestData.state ?? "N/A"}` },
        { type: "mrkdwn", text: `*Contact:*\n${requestData.contact_name ?? "N/A"} (${requestData.contact_email ?? "N/A"})` },
      ],
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: "findabusiness.com.au — needs admin review" }],
    },
  ];
  return postToSlack({ blocks });
}

export async function sendNewReviewAlert(reviewData: {
  reviewer_name?: string;
  reviewer_email?: string;
  rating?: number;
  content?: string;
  business_name?: string;
}) {
  const stars = "⭐".repeat(reviewData.rating ?? 0);
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `⭐ New Review — ${reviewData.business_name ?? "Unknown Business"}` },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${stars}\n>${reviewData.content ?? "No content"}\n\nFrom: ${reviewData.reviewer_name ?? "Anonymous"} (${reviewData.reviewer_email ?? "no email"})`,
      },
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: "findabusiness.com.au — needs moderation" }],
    },
  ];
  return postToSlack({ blocks });
}
