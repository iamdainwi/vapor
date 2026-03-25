import { Ollama } from "ollama";

export interface SummaryResult {
  thesis: string;
  bullets: string[];
}

const SYSTEM_PROMPT = `You are a brutal content summarizer for VAPOR, an ephemeral read-it-later app. Your job is to extract the absolute core of an article in the most concise, no-nonsense way possible.

RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation.
- Format: {"thesis": "one sentence core argument", "bullets": ["point 1", "point 2", "point 3", "point 4", "point 5"]}
- The thesis must be ONE sentence capturing the core argument or finding.
- Exactly 5 bullets. Each bullet is one sentence max.
- Be direct. No hedging. No "the article discusses..." — just state the facts.
- If the content is garbage or too short, return: {"thesis": "Content could not be meaningfully summarized.", "bullets": ["Insufficient or unreadable content.", "Try a different URL.", "Time is wasting."]}`;

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

/**
 * Summarizes article text using Ollama Cloud API.
 * Uses the official ollama JS library per:
 * https://docs.ollama.com/cloud#javascript
 */
export async function summarizeText(text: string): Promise<SummaryResult> {
  // Truncate to ~4000 chars to fit context window
  const truncated = text.slice(0, 10000);

  const response = await ollama.chat({
    model: "gpt-oss:120b-cloud",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Summarize the following article content:\n\n${truncated}`,
      },
    ],
    stream: false,
    format: "json",
  });

  const parsed = JSON.parse(response.message.content);

  return {
    thesis: parsed.thesis || "No thesis extracted.",
    bullets: Array.isArray(parsed.bullets)
      ? parsed.bullets.slice(0, 5)
      : ["Summary generation failed."],
  };
}
