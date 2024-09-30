/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "code" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_code_key" ON "Profile"("code");
