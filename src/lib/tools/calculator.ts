import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const schema = z.object({
  expression: z
    .string()
    .describe(
      "A mathematical expression to evaluate. Supports: +, -, *, /, **, %, (), and Math.* functions (e.g., Math.sqrt, Math.round, Math.pow, Math.abs). Example: '(79.99 - 74.99) / 79.99 * 100'"
    ),
});

/**
 * Safely evaluates a mathematical expression using a restricted scope.
 * Only allows numeric literals, operators, and Math.* functions.
 */
function safeEval(expression: string): number {
  const sanitized = expression.replace(/\s+/g, " ").trim();

  // Allow only safe characters: digits, operators, parentheses, decimals, Math., and spaces
  const allowed = /^[\d\s+\-*/().,%^&|~<>=!a-zA-Z.]+$/;
  if (!allowed.test(sanitized)) {
    throw new Error("Expression contains disallowed characters");
  }

  // Create a restricted scope with only Math functions and constants
  const mathContext = {
    Math: {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      sqrt: Math.sqrt,
      pow: Math.pow,
      max: Math.max,
      min: Math.min,
      PI: Math.PI,
      E: Math.E,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      log: Math.log,
      log10: Math.log10,
      exp: Math.exp,
      sign: Math.sign,
      trunc: Math.trunc,
    },
    // Common aliases
    sqrt: Math.sqrt,
    round: Math.round,
    abs: Math.abs,
    PI: Math.PI,
    E: Math.E,
  };

  try {
    const fn = new Function(
      ...Object.keys(mathContext),
      `"use strict"; return (${sanitized})`
    );
    const result = fn(...Object.values(mathContext));

    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Result is not a finite number");
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to evaluate expression: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description:
    "Evaluates mathematical expressions. Use for price difference calculations, percentage changes, markup analysis, or any numeric computation. Returns a precise numeric result.",
  schema,
  func: async ({ expression }) => {
    try {
      const result = safeEval(expression);
      return String(result);
    } catch (error) {
      return `Calculation error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
