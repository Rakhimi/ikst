/*
  Warnings:

  - Made the column `endTime` on table `QuestionSet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QuestionSet" ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "endTime" SET DEFAULT '2024-01-01 00:00:00 +00:00';
