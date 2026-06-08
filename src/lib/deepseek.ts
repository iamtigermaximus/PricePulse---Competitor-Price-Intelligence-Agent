import { ChatOpenAI } from "@langchain/openai";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export interface DeepSeekConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createDeepSeek(config: DeepSeekConfig = {}) {
  return new ChatOpenAI({
    model: config.model ?? "deepseek-v4-pro",
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    temperature: config.temperature ?? 0,
    maxTokens: config.maxTokens ?? 2048,
    configuration: {
      baseURL: DEEPSEEK_BASE_URL,
    },
  });
}
