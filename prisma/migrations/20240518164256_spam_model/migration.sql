/*
  Warnings:

  - A unique constraint covering the columns `[userId,phone]` on the table `Spam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Spam_userId_phone_key` ON `Spam`(`userId`, `phone`);
