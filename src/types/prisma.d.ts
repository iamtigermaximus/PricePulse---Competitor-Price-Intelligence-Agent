import { PrismaClient } from "@prisma/client";

// Augment PrismaClient with QueryLog until prisma generate is re-run
declare module "@prisma/client" {
  interface PrismaClient {
    queryLog: {
      create(args: {
        data: {
          query: string;
          response: string;
          steps?: unknown;
          duration?: number;
        };
      }): Promise<unknown>;
    };
  }
}
