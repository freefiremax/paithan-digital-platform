import { z } from "zod";

const settingsSchema = z.object({
  model: z.string().regex(/^gemini-[a-zA-Z0-9.-]+$/).default("gemini-3.8-flash"),
  fallbackModel: z.string().regex(/^gemini-[a-zA-Z0-9.-]+$/).default("gemini-3.5-flash-lite"),
  timeoutMs: z.coerce.number().int().min(2000).max(12000).default(8000),
  maxOutputTokens: z.coerce.number().int().min(300).max(4096).default(1800),
});

export function chatbotSettings() {
  const legacy = (process.env.GEMINI_MODEL || process.env.GEMINI_CHAT_MODEL)?.trim();
  return settingsSchema.parse({
    // Explicit CHATBOT_MODEL accepts any valid Gemini ID; legacy retired IDs are migrated.
    model: process.env.CHATBOT_MODEL || (legacy?.startsWith("gemini-3.") ? legacy : undefined),
    fallbackModel: process.env.CHATBOT_FALLBACK_MODEL,
    timeoutMs: process.env.CHATBOT_TIMEOUT_MS,
    maxOutputTokens: process.env.CHATBOT_MAX_OUTPUT_TOKENS,
  });
}
