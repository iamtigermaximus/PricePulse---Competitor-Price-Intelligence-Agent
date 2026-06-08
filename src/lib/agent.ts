import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { allTools } from "./tools";
import { createDeepSeek } from "./deepseek";

const model = createDeepSeek();

const systemPrompt = `You are a pricing intelligence agent for PricePulse. Your job is to help users understand their competitive pricing landscape.

You have three tools available:

1. **web_search** — Searches the web via DuckDuckGo. Use this to find current competitor prices, market trends, or product information from external sources.

2. **price_compare** — Queries the internal database for your product prices and known competitor prices. Use this to compare your pricing against competitors you track.

3. **calculator** — Evaluates mathematical expressions. Use this to compute price differences, percentage changes, or any numeric analysis.

Guidelines:
- When a user asks about pricing, first check your internal database with price_compare, then supplement with web_search if more context is needed.
- Always show specific numbers: prices, differences, and percentages.
- When comparing prices, clearly state whether your price is higher, lower, or matched vs each competitor.
- Provide actionable recommendations based on the data (e.g., "You are 6.7% above the market average — consider a price adjustment").
- If the DeepSeek API key is not configured, inform the user politely.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({
  llm: model,
  tools: allTools,
  prompt,
});

export const agentExecutor = new AgentExecutor({
  agent,
  tools: allTools,
  verbose: process.env.NODE_ENV === "development",
  maxIterations: 10,
  returnIntermediateSteps: true,
});

export interface AgentResponse {
  output: string;
  intermediateSteps: Array<{
    action: string;
    input: string;
    output: string;
  }>;
}

export async function runAgent(input: string): Promise<AgentResponse> {
  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      output:
        "DeepSeek API key is not configured. Please set the DEEPSEEK_API_KEY environment variable in your .env file.",
      intermediateSteps: [],
    };
  }

  try {
    const result = await agentExecutor.invoke({ input });

    return {
      output: result.output as string,
      intermediateSteps: (result.intermediateSteps || []).map(
        (step: { action: { tool: string; toolInput: unknown }; observation: string }) => ({
          action: step.action.tool,
          input: JSON.stringify(step.action.toolInput),
          output: step.observation,
        })
      ),
    };
  } catch (error) {
    return {
      output: `Agent error: ${error instanceof Error ? error.message : String(error)}`,
      intermediateSteps: [],
    };
  }
}
