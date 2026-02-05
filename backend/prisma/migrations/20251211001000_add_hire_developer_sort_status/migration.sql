-- Add sortOrder/isActive fields for hire developer modules
ALTER TABLE `HireContactButton` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_services` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_technologies` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_benefits` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_pricing` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_process` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_why_vedx` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_why_choose` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_industries` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_tech_solutions` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_expertise` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `hire_developer_our_services` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0, ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
