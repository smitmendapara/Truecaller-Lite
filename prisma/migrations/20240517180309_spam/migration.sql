/*
  Warnings:

  - You are about to drop the column `contactId` on the `Spam` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Spam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Spam` DROP FOREIGN KEY `Spam_contactId_fkey`;

-- AlterTable
ALTER TABLE `Spam` DROP COLUMN `contactId`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `spamCount` INTEGER NOT NULL DEFAULT 0;
