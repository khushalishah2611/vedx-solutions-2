-- Add hero and table content fields to WhyService
ALTER TABLE `WhyService`
  ADD COLUMN `heroTitle` VARCHAR(191) NULL,
  ADD COLUMN `heroDescription` LONGTEXT NULL,
  ADD COLUMN `heroImage` LONGTEXT NULL,
  ADD COLUMN `tableTitle` VARCHAR(191) NULL,
  ADD COLUMN `tableDescription` LONGTEXT NULL;

-- Backfill existing rows with empty strings so we can enforce NOT NULL
UPDATE `WhyService` SET `heroTitle` = '' WHERE `heroTitle` IS NULL;
UPDATE `WhyService` SET `heroDescription` = '' WHERE `heroDescription` IS NULL;
UPDATE `WhyService` SET `heroImage` = '' WHERE `heroImage` IS NULL;
UPDATE `WhyService` SET `tableTitle` = '' WHERE `tableTitle` IS NULL;
UPDATE `WhyService` SET `tableDescription` = '' WHERE `tableDescription` IS NULL;

-- Make the new columns required
ALTER TABLE `WhyService`
  MODIFY `heroTitle` VARCHAR(191) NOT NULL,
  MODIFY `heroDescription` LONGTEXT NOT NULL,
  MODIFY `heroImage` LONGTEXT NOT NULL,
  MODIFY `tableTitle` VARCHAR(191) NOT NULL,
  MODIFY `tableDescription` LONGTEXT NOT NULL;
