import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { exec } from "node:child_process";

export const TEST_DB_NAME = "fastify_prisma_todo_app_test";

export function getTestDbPrismaClient() {
  const testDbUrl = new URL(process.env.DATABASE_URL);
  testDbUrl.pathname = TEST_DB_NAME;
  const testDbUrlStr = testDbUrl.toString();

  return new PrismaClient({
    log: ["warn", "error"],
    datasources: { db: { url: testDbUrlStr } },
  });
}

export default async () => {
  console.log("Connecting to the database...");
  let client = new PrismaClient({ log: ["warn", "error"] });
  console.log("Creating test database...");
  const result =
    await client.$queryRaw`SELECT 1 FROM pg_database WHERE datname = '${TEST_DB_NAME}'`;
  if (!result) {
    await client.$executeRaw`CREATE DATABASE "${TEST_DB_NAME}"`;
  }
  await client.$disconnect();

  const testDbUrl = new URL(process.env.DATABASE_URL);
  testDbUrl.pathname = TEST_DB_NAME;
  const testDbUrlStr = testDbUrl.toString();

  console.log("Resetting and migrating test database...");
  exec(`DATABASE_URL=${testDbUrlStr} npx prisma migrate reset --force`);
  exec(`DATABASE_URL=${testDbUrlStr} npx prisma migrate deploy`);

  console.log("Connecting to the test database...");
  client = new PrismaClient({
    log: ["warn", "error"],
    datasources: { db: { url: testDbUrlStr } },
  });
  await client.$connect();
  await client.$disconnect();

  console.log("Initial setup complete.");
};
