/*
  Warnings:

  - Changed the type of `school` on the `Result` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "school",
ADD COLUMN     "school" "SchoolOption" NOT NULL;
