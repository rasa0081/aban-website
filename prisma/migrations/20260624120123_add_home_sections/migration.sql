-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `intro` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `type` VARCHAR(20) NOT NULL DEFAULT 'normal',
    `image` VARCHAR(1000) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `date` VARCHAR(50) NOT NULL,
    `fontSize` INTEGER NOT NULL DEFAULT 16,
    `fontColor` VARCHAR(20) NOT NULL DEFAULT '#1a1e24',
    `isBold` BOOLEAN NOT NULL DEFAULT false,
    `isItalic` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `image` VARCHAR(1000) NULL,
    `tags` VARCHAR(500) NOT NULL DEFAULT '',
    `year` VARCHAR(20) NOT NULL,
    `client` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `duration` VARCHAR(100) NULL,
    `url` VARCHAR(1000) NULL,
    `features` TEXT NULL,
    `videoUrl` VARCHAR(1000) NULL,
    `videoTitle` VARCHAR(500) NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `value` LONGTEXT NOT NULL,

    UNIQUE INDEX `site_content_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(300) NULL,
    `subtitle` VARCHAR(300) NULL,
    `image` VARCHAR(1000) NULL,
    `link` VARCHAR(1000) NULL,
    `bgColor` VARCHAR(20) NOT NULL DEFAULT '#0c2b29',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `logo` VARCHAR(1000) NULL,
    `url` VARCHAR(500) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `parentId` INTEGER NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `article_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `section_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionId` VARCHAR(50) NOT NULL,
    `src` VARCHAR(1000) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` VARCHAR(200) NULL,
    `details` TEXT NULL,
    `category` VARCHAR(100) NULL,
    `date` VARCHAR(20) NULL,
    `rating` VARCHAR(20) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `home_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionKey` VARCHAR(50) NOT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'card',
    `title` VARCHAR(500) NOT NULL,
    `subtitle` TEXT NULL,
    `buttons` LONGTEXT NOT NULL DEFAULT '[]',
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `home_sections_sectionKey_key`(`sectionKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_categories` ADD CONSTRAINT `article_categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `article_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
