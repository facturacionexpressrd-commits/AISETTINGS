/**
 * LLM Intent Parser — Claude understands natural language commands
 * Falls back to regex if API unavailable
 */

import type { SaaS } from "./variants";
import type { StudioConfig } from "./types";
import { getCommandsForType } from "./commands";

export interface ParseResult {
  action: string;
  params: Record<string, any>;
  confidence: number;
  method: "llm" | "regex";
}

/**
 * Parse user message with Claude API
 * Understands natural language, not just exact patterns
 */
export async function parseWithClaude(
  message: string,
  saasType: SaaS,
  config: StudioConfig,
  apiKey?: string
): Promise<ParseResult | null> {
  if (!apiKey) {
    return null; // Fall back to regex
  }

  try {
    const commands = getCommandsForType(saasType);
    const commandList = commands
      .map((c) => `• ${c.action}: ${c.description}`)
      .join("\n");

    const prompt = `You are a ${config.identity.role} AI assistant. Parse this user message into a structured command.

Available actions:
${commandList}

User message: "${message}"

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "action": "the_action_name",
  "params": {"key": "value"},
  "confidence": 0.95
}

If you cannot parse it, return:
{
  "action": null,
  "params": {},
  "confidence": 0
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-5-5",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.warn(`Claude API error: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as any;
    const content = data.content[0]?.text;

    if (!content) {
      return null;
    }

    const parsed = JSON.parse(content);

    if (!parsed.action) {
      return null;
    }

    return {
      action: parsed.action,
      params: parsed.params || {},
      confidence: parsed.confidence || 0.8,
      method: "llm",
    };
  } catch (err) {
    console.warn("Claude parsing failed, falling back to regex", err);
    return null;
  }
}

/**
 * Hybrid parser: try LLM first, fall back to regex
 */
export async function parseMessage(
  message: string,
  saasType: SaaS,
  config: StudioConfig,
  options?: {
    apiKey?: string;
    preferLLM?: boolean;
    minConfidence?: number;
  }
): Promise<ParseResult | null> {
  const { apiKey, preferLLM = true, minConfidence = 0.6 } = options || {};

  // Try LLM first if enabled
  if (preferLLM && apiKey) {
    const llmResult = await parseWithClaude(message, saasType, config, apiKey);
    if (llmResult && llmResult.confidence >= minConfidence) {
      return llmResult;
    }
  }

  // Fall back to regex
  const regexResult = parseRegex(message, saasType);
  if (regexResult) {
    return regexResult;
  }

  return null;
}

/**
 * Parse using regex patterns (fallback)
 */
function parseRegex(
  text: string,
  saasType: SaaS
): ParseResult | null {
  const { parseCommand } = require("./commands");
  const result = parseCommand(text, saasType);

  if (result) {
    return {
      ...result,
      confidence: 1.0,
      method: "regex",
    };
  }

  return null;
}

/**
 * Stream-friendly parser for chat (returns immediately)
 */
export async function parseMessageStreaming(
  message: string,
  saasType: SaaS,
  config: StudioConfig,
  apiKey?: string,
  onProgress?: (status: string) => void
): Promise<ParseResult | null> {
  onProgress?.("Parsing command...");

  // Quick regex check first
  const regexResult = parseRegex(message, saasType);
  if (regexResult) {
    onProgress?.("Command recognized");
    return regexResult;
  }

  // Try LLM
  if (apiKey) {
    onProgress?.("Using AI to understand...");
    const llmResult = await parseWithClaude(message, saasType, config, apiKey);
    if (llmResult && llmResult.confidence >= 0.6) {
      onProgress?.("AI understood");
      return llmResult;
    }
  }

  onProgress?.("Command not recognized");
  return null;
}
