# PricePulse — Competitor Price Intelligence Agent

An AI-powered agent that monitors competitor pricing, compares products, and recommends pricing strategies.

Built with **Next.js 15**, **LangChain.js**, **DeepSeek V4 Pro**, and **Neon PostgreSQL**.

## Features

- **Chat Interface** — Ask questions about competitor pricing in natural language
- **Web Search** — Automatically searches DuckDuckGo for current market prices
- **Price Comparison** — Queries your database to compare your prices against competitors
- **Calculator** — Computes price differences, percentages, and markup analysis
- **Reasoning Panel** — See every tool call the agent makes, step by step
- **Dark Mode** — Toggle between light and dark themes
- **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Styled Components |
| Database | Prisma 6 + Neon PostgreSQL |
| AI Agent | LangChain.js + DeepSeek V4 Pro |
| Web Search | DuckDuckGo (free, no API key) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [DeepSeek](https://platform.deepseek.com) API key

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd "PricePulse - Competitor Price Intelligent Agent"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (5 products with competitor prices)
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

Ask the agent questions like:

- *"Compare our headphone prices against competitors"*
- *"What's the cheapest product in Electronics?"*
- *"Search for current market prices of wireless headphones"*
- *"Show me all products with their competitor prices"*
- *"How much above the market average are our chairs?"*

The agent will call tools as needed and show its reasoning steps in the right panel.

## API

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"input": "Compare our headphone prices"}'
```

Response:

```json
{
  "output": "Found 1 product...",
  "intermediateSteps": [...],
  "duration": 4823
}
```

## Project Structure

```
src/
├── app/
│   ├── api/agent/route.ts    # POST /api/agent endpoint
│   ├── globals.css            # Global styles + theme variables
│   ├── layout.tsx             # Root layout with styled-components registry
│   └── page.tsx               # Main chat page
├── components/
│   ├── ChatUI.tsx             # Two-column chat + reasoning UI
│   ├── MarkdownRenderer.tsx   # Renders markdown from agent responses
│   └── ThemeToggle.tsx        # Dark/light mode toggle
├── lib/
│   ├── agent.ts               # LangChain agent executor
│   ├── deepseek.ts            # DeepSeek LLM wrapper
│   ├── demo-scenario.ts       # Sample conversation for preview
│   ├── prisma.ts              # Prisma client singleton
│   ├── registry.tsx           # Styled-components SSR registry
│   └── tools/
│       ├── web-search.ts      # DuckDuckGo search tool
│       ├── calculator.ts      # Math expression evaluator
│       ├── price-compare.ts   # Database price comparison tool
│       └── index.ts           # Tool barrel exports
└── types/
    ├── markdown.d.ts          # react-markdown type declarations
    └── prisma.d.ts            # Prisma type augmentation
prisma/
├── schema.prisma              # Product, CompetitorPrice, QueryLog models
└── seed.ts                    # Sample data seeder
```

## Deployment

### Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (`DEEPSEEK_API_KEY`, `DATABASE_URL`)
4. Deploy

The `postinstall` script automatically runs `prisma generate` during build.

## License

MIT
