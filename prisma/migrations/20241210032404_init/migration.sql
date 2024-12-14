-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `maiden` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `sport` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `school` ENUM('ALSTX', 'WDLTX', 'BILTX', 'MCAMI', 'MABIL') NOT NULL DEFAULT 'ALSTX',
    `grade` ENUM('GR3', 'GR7') NOT NULL DEFAULT 'GR3',

    UNIQUE INDEX `Profile_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `grade` ENUM('GR3', 'GR7') NOT NULL DEFAULT 'GR3',
    `type` ENUM('Islamic', 'Quran') NOT NULL DEFAULT 'Quran',
    `endTime` DATETIME(3) NOT NULL DEFAULT '2024-01-01 00:00:00',
    `startTime` DATETIME(3) NOT NULL DEFAULT '2024-01-01 00:00:00',
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `grade` ENUM('GR3', 'GR7') NOT NULL,
    `year` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `islamicSetId` INTEGER NOT NULL,
    `quranSetId` INTEGER NOT NULL,

    UNIQUE INDEX `Cycle_islamicSetId_key`(`islamicSetId`),
    UNIQUE INDEX `Cycle_quranSetId_key`(`quranSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `option1` VARCHAR(191) NOT NULL,
    `option2` VARCHAR(191) NOT NULL,
    `option3` VARCHAR(191) NOT NULL,
    `option4` VARCHAR(191) NOT NULL,
    `answer` ENUM('A', 'B', 'C', 'D', 'UNANSWERED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `questionSetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnswerSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileId` INTEGER NOT NULL,
    `questionSetId` INTEGER NOT NULL,
    `result` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `option` ENUM('A', 'B', 'C', 'D', 'UNANSWERED') NULL,
    `questionId` INTEGER NOT NULL,
    `answerSetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `score` INTEGER NOT NULL,
    `questionSetId` INTEGER NOT NULL,
    `allSchool` INTEGER NOT NULL,
    `school` ENUM('ALSTX', 'WDLTX', 'BILTX', 'MCAMI', 'MABIL') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionSet` ADD CONSTRAINT `QuestionSet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cycle` ADD CONSTRAINT `Cycle_islamicSetId_fkey` FOREIGN KEY (`islamicSetId`) REFERENCES `QuestionSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cycle` ADD CONSTRAINT `Cycle_quranSetId_fkey` FOREIGN KEY (`quranSetId`) REFERENCES `QuestionSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_questionSetId_fkey` FOREIGN KEY (`questionSetId`) REFERENCES `QuestionSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnswerSet` ADD CONSTRAINT `AnswerSet_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnswerSet` ADD CONSTRAINT `AnswerSet_questionSetId_fkey` FOREIGN KEY (`questionSetId`) REFERENCES `QuestionSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_answerSetId_fkey` FOREIGN KEY (`answerSetId`) REFERENCES `AnswerSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_questionSetId_fkey` FOREIGN KEY (`questionSetId`) REFERENCES `QuestionSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
