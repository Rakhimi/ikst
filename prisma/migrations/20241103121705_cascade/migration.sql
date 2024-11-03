-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_answerSetId_fkey";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answerSetId_fkey" FOREIGN KEY ("answerSetId") REFERENCES "AnswerSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
