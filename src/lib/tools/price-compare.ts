import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  productName: z
    .string()
    .optional()
    .describe("Name or partial name of the product to look up"),
  sku: z
    .string()
    .optional()
    .describe("Exact SKU of the product to look up"),
  category: z
    .string()
    .optional()
    .describe("Filter by product category (e.g., Electronics, Apparel)"),
});

export const priceCompareTool = new DynamicStructuredTool({
  name: "price_compare",
  description:
    "Queries the database for product pricing and compares against competitor prices. Returns your price, competitor prices, and price differences. Leave empty to see all products.",
  schema,
  func: async ({ productName, sku, category }) => {
    try {
      // Build the where clause dynamically
      const where: Record<string, unknown> = {};

      if (sku) {
        where.sku = sku;
      }

      if (productName) {
        where.name = { contains: productName, mode: "insensitive" };
      }

      if (category) {
        where.category = { contains: category, mode: "insensitive" };
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          competitorPrices: {
            orderBy: { price: "asc" },
          },
        },
        orderBy: { name: "asc" },
      });

      if (products.length === 0) {
        return `No products found${productName ? ` matching "${productName}"` : ""}${sku ? ` with SKU "${sku}"` : ""}${category ? ` in category "${category}"` : ""}.`;
      }

      const lines: string[] = [];
      lines.push(`Found ${products.length} product(s):\n`);

      for (const product of products) {
        lines.push(`Product: ${product.name}`);
        lines.push(`  SKU: ${product.sku}`);
        lines.push(`  Category: ${product.category}`);
        lines.push(`  Our Price: $${product.ourPrice.toFixed(2)}`);

        if (product.competitorPrices.length > 0) {
          lines.push(`  Competitor Prices:`);
          for (const cp of product.competitorPrices) {
            const diff = cp.price - product.ourPrice;
            const sign = diff > 0 ? "+" : "";
            const pct =
              diff !== 0
                ? ` (${sign}${((diff / product.ourPrice) * 100).toFixed(1)}%)`
                : " (same)";
            lines.push(
              `    - ${cp.competitorName}: $${cp.price.toFixed(2)}${pct}${cp.url ? ` [${cp.url}]` : ""}`
            );
          }

          // Calculate lowest and average competitor price
          const prices = product.competitorPrices.map((cp) => cp.price);
          const lowest = Math.min(...prices);
          const average =
            prices.reduce((a, b) => a + b, 0) / prices.length;

          lines.push(`  Lowest competitor: $${lowest.toFixed(2)}`);
          lines.push(`  Average competitor: $${average.toFixed(2)}`);
          lines.push(
            `  Our position vs lowest: ${product.ourPrice > lowest ? "$" + (product.ourPrice - lowest).toFixed(2) + " above" : product.ourPrice < lowest ? "$" + (lowest - product.ourPrice).toFixed(2) + " below" : "matched"}`
          );
        } else {
          lines.push(`  No competitor prices recorded yet.`);
        }

        lines.push(""); // blank line between products
      }

      return lines.join("\n");
    } catch (error) {
      return `Database query failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
