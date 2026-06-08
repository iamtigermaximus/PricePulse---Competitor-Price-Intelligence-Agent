import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAgent } from "@/lib/agent";
import { prisma } from "@/lib/prisma";

// Ensure Node.js runtime (Prisma + LangChain don't support Edge)
export const runtime = "nodejs";

const requestSchema = z.object({
  input: z.string().min(1, "Query cannot be empty").max(2000, "Query too long"),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { input } = parsed.data;
    const result = await runAgent(input);
    const duration = Date.now() - startTime;

    // Log the query and response to the database
    try {
      await prisma.queryLog.create({
        data: {
          query: input,
          response: result.output,
          steps: result.intermediateSteps,
          duration,
        },
      });
    } catch (dbError) {
      // Don't fail the request if logging fails
      console.error("Failed to log query:", dbError);
    }

    return NextResponse.json({
      output: result.output,
      intermediateSteps: result.intermediateSteps,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        error: `Failed to process query: ${error instanceof Error ? error.message : String(error)}`,
        duration,
      },
      { status: 500 }
    );
  }
}
