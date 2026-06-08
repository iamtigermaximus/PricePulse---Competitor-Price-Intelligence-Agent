import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

const schema = z.object({
  query: z.string().describe("The search query to look up on the web"),
});

async function searchDuckDuckGo(query: string): Promise<string> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo returned status ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const results: string[] = [];

  $(".result").each((_i, el) => {
    const title = $(el).find(".result__title").text().trim();
    const snippet = $(el).find(".result__snippet").text().trim();
    const link = $(el).find(".result__url").attr("href") || "";

    if (title || snippet) {
      results.push(`Title: ${title}\nURL: ${link}\nSnippet: ${snippet}`);
    }
  });

  if (results.length === 0) {
    return `No results found for "${query}".`;
  }

  return results.slice(0, 10).join("\n\n");
}

export const webSearchTool = new DynamicStructuredTool({
  name: "web_search",
  description:
    "Searches the web using DuckDuckGo for current competitor pricing, product information, or market data. Free, no API key needed.",
  schema,
  func: async ({ query }) => {
    try {
      return await searchDuckDuckGo(query);
    } catch (error) {
      return `Search failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
