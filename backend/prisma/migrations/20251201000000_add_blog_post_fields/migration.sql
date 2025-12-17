-- Extend blog posts with additional copy and media fields and allow longer text
ALTER TABLE `BlogPost`
  ADD COLUMN `subtitle` VARCHAR(191) NULL,
  ADD COLUMN `shortDescription` LONGTEXT NULL,
  ADD COLUMN `longDescription` LONGTEXT NULL,
  ADD COLUMN `conclusion` LONGTEXT NULL,
  ADD COLUMN `blogImage` LONGTEXT NULL,
  MODIFY `summary` LONGTEXT NULL,
  MODIFY `content` LONGTEXT NOT NULL,
  MODIFY `coverImage` LONGTEXT NULL;
