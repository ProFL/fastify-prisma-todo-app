import { PrismaClient } from "@prisma/client";
import { container, instanceCachingFactory } from "tsyringe";

export type AppPrismaClient = PrismaClient<{
  log: [
    { emit: "event"; level: "query" },
    { emit: "stdout"; level: "info" },
    { emit: "stdout"; level: "warn" },
    { emit: "stdout"; level: "error" }
  ];
}>;

export function registerPrismaClient() {
  container.register(PrismaClient, {
    useFactory: instanceCachingFactory<PrismaClient>(
      () =>
        new PrismaClient({
          log: [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "info" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ],
        })
    ),
  });
}
