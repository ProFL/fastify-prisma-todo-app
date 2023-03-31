-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" VARCHAR(5) NOT NULL DEFAULT 'TO_DO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_title_idx" ON "Task" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task" USING GIN ("status" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");

-- CreateIndex
CREATE INDEX "Task_updatedAt_idx" ON "Task"("updatedAt");
