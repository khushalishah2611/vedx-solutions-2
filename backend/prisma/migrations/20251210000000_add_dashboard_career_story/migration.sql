-- Create DashboardStory table
CREATE TABLE `DashboardStory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `extendedDescription` LONGTEXT NULL,
  `imageBase` LONGTEXT NULL,
  `imageOverlay` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create CareerStory table
CREATE TABLE `CareerStory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `extendedDescription` LONGTEXT NULL,
  `imageBase` LONGTEXT NULL,
  `imageOverlay` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Update ContactButton fields to allow long text
ALTER TABLE `ContactButton`
  MODIFY `title` LONGTEXT NOT NULL,
  MODIFY `description` LONGTEXT NULL;
