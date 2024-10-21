/*
  Warnings:

  - The `school` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `grade` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SchoolOption" AS ENUM ('ALSTX', 'WDLTX', 'BILTX', 'MCAMI', 'MABIL');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "school",
ADD COLUMN     "school" "SchoolOption" NOT NULL DEFAULT 'ALSTX',
DROP COLUMN "grade",
ADD COLUMN     "grade" "GradeOption" NOT NULL DEFAULT 'GR3';
