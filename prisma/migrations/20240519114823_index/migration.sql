-- CreateIndex
CREATE INDEX `Contact_phone_idx` ON `Contact`(`phone`);

-- CreateIndex
CREATE INDEX `Contact_name_idx` ON `Contact`(`name`);

-- CreateIndex
CREATE INDEX `Spam_phone_idx` ON `Spam`(`phone`);

-- CreateIndex
CREATE INDEX `Spam_userId_phone_idx` ON `Spam`(`userId`, `phone`);

-- CreateIndex
CREATE INDEX `User_phone_idx` ON `User`(`phone`);
