/*
  Warnings:

  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_questionSetId_fkey";

-- AlterTable
ALTER TABLE "QuestionSet" ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 00:00:00 +00:00';

-- DropTable
DROP TABLE "Schedule";
