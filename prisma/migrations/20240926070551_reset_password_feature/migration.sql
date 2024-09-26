/*
  Warnings:

  - Added the required column `color` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maiden` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sport` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "maiden" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "sport" TEXT NOT NULL;
