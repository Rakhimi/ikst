/*
  Warnings:

  - You are about to drop the column `profileId` on the `User` table. All the data in the column will be lost.
  - Made the column `userId` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "User_profileId_key";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileId";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
