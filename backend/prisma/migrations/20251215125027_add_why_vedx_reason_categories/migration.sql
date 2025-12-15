-- AlterTable
ALTER TABLE `WhyVedxReason`
  ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `subcategory` VARCHAR(191) NULL;
