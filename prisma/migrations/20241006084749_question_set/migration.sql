-- CreateEnum
CREATE TYPE "GradeOption" AS ENUM ('GR3', 'GR7');

-- CreateEnum
CREATE TYPE "TypeOption" AS ENUM ('Islamic', 'Quran');

-- AlterTable
ALTER TABLE "QuestionSet" ADD COLUMN     "grade" "GradeOption" NOT NULL DEFAULT 'GR3',
ADD COLUMN     "type" "TypeOption" NOT NULL DEFAULT 'Quran';
