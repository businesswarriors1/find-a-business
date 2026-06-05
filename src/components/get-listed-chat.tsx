"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "G'day! I'm here to get your business listed on findabusiness.com.au — it's free. To start, what's the name of your business and what does it do?",
};

export function GetListedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // Honeypot — bots fill this, humans never see it.
  const [honeypot, setHoneypot] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading || submitted) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          honeypot_field: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.message) {
        // Strip the submission JSON block from what we show the user.
        const clean = String(data.message).replace(/```json[\s\S]*?```/g, "").trim();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: clean || "Thanks — I've got everything I need!",
          },
        ]);
      }

      if (data.submitted) setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-primary text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold font-heading leading-tight">Get Listed Free</p>
          <p className="text-xs text-white/80">Chat with our assistant — takes about two minutes</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-[380px] overflow-y-auto px-4 py-4 space-y-3 bg-light-bg/40">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-white border border-border text-dark rounded-bl-sm",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-mid" />
            </div>
          </div>
        )}

        {submitted && (
          <div className="flex items-start gap-2 bg-success/10 border border-success/20 rounded-lg px-4 py-3 text-sm text-dark">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <span>
              Your details are in! Our team will review your listing and be in touch within 24
              hours. You can close this window.
            </span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-100">
          {error}
        </div>
      )}

      {/* Honeypot — visually hidden, off-screen, not focusable */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_url">Leave this field empty</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3 bg-white">
        {submitted ? (
          <p className="text-center text-sm text-mid py-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cta" /> Thanks for getting listed with us!
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message…"
              className="flex-1 resize-none border border-border rounded-lg px-3 py-2.5 text-sm min-h-[44px] max-h-32 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="inline-flex items-center justify-center gap-1.5 bg-cta text-white font-semibold rounded-lg px-4 h-[44px] hover:bg-cta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
