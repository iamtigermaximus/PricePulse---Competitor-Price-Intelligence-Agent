import type { Message } from "@/components/ChatUI";

export const demoMessages: Message[] = [
  {
    id: "demo-1",
    role: "user",
    content: "Compare our headphone prices against competitors",
  },
  {
    id: "demo-2",
    role: "assistant",
    content: `I've analyzed our headphone pricing against the competition. Here's the full breakdown:

## Product: Wireless Bluetooth Headphones

| Metric | Value |
|--------|-------|
| **Our Price** | **$79.99** |
| Lowest Competitor | $74.99 (TechGiant) |
| Highest Competitor | $89.99 (SoundPro) |
| Average Competitor | **$82.49** |
| Our Position | **2nd lowest** out of 3 |

### Competitor Comparison

| Competitor | Price | Difference | vs Us |
|------------|-------|-----------|-------|
| TechGiant | $74.99 | -$5.00 (-6.3%) | **Lower** |
| SoundPro | $89.99 | +$10.00 (+12.5%) | Higher |

### Recommendation

**You're priced competitively** — $5 above the lowest competitor but $10 below the highest. Consider:

1. **Hold price** if you're competing on quality/features
2. **Drop to $74.99** to match TechGiant if market share is the priority
3. **Bundle offer** at $84.99 with accessories to differentiate

> *"A price reduction of 6.3% could capture additional market share, but you'd need to increase volume by at least 15% to maintain revenue."*

\`\`\`
Price elasticity estimate:
  Current revenue:  $79.99/unit
  At $74.99:       need 6.7% more volume
  At $69.99:       need 14.3% more volume
\`\`\``,
    steps: [
      {
        action: "price_compare",
        input: JSON.stringify({ productName: "headphone" }),
        output:
          "Found 1 product(s):\n\nProduct: Wireless Bluetooth Headphones\n  SKU: WBH-001\n  Category: Electronics\n  Our Price: $79.99\n  Competitor Prices:\n    - TechGiant: $74.99 (-6.3%)\n    - SoundPro: $89.99 (+12.5%)\n  Lowest competitor: $74.99\n  Average competitor: $82.49\n  Our position vs lowest: $5.00 above",
      },
      {
        action: "calculator",
        input: JSON.stringify({ expression: "(89.99 - 79.99) / 79.99 * 100" }),
        output: "12.5",
      },
      {
        action: "calculator",
        input: JSON.stringify({ expression: "(79.99 - 74.99) / 79.99 * 100" }),
        output: "6.25",
      },
      {
        action: "web_search",
        input: JSON.stringify({
          query: "wireless bluetooth headphone market price trends 2026",
        }),
        output:
          "Title: Wireless Headphone Market Report 2026\nURL: example.com/headphone-report\nSnippet: Average selling prices for wireless headphones range from $65-$150 with premium brands commanding $120+.",
      },
    ],
    duration: 4823,
  },
];
