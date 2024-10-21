/*
  Warnings:

  - You are about to drop the column `result` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnswerSet" ADD COLUMN     "result" INTEGER;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "result";
