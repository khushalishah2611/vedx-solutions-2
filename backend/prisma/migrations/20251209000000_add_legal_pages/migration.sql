-- Update Banner type enum to include legal pages
ALTER TABLE `Banner`
  MODIFY `type` ENUM('HOME','DASHBOARD','ABOUT','BLOGS','CONTACT','CAREER','CASESTUDY','PRIVACY_POLICY','TERMS_CONDITION') NOT NULL;

-- Create PrivacyPolicy table
CREATE TABLE `PrivacyPolicy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create TermsCondition table
CREATE TABLE `TermsCondition` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
