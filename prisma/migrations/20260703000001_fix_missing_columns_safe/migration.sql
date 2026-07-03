-- Safely add missing columns only if they don't already exist

-- Articles: metaDescription
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
  WHERE table_schema = DATABASE() AND table_name = 'articles' AND column_name = 'metaDescription');
SET @sql := IF(@exist = 0, 'ALTER TABLE articles ADD COLUMN metaDescription VARCHAR(300) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Articles: keywords
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
  WHERE table_schema = DATABASE() AND table_name = 'articles' AND column_name = 'keywords');
SET @sql := IF(@exist = 0, 'ALTER TABLE articles ADD COLUMN keywords VARCHAR(500) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Articles: likes
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
  WHERE table_schema = DATABASE() AND table_name = 'articles' AND column_name = 'likes');
SET @sql := IF(@exist = 0, 'ALTER TABLE articles ADD COLUMN likes INT NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Portfolio: showPreview
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
  WHERE table_schema = DATABASE() AND table_name = 'portfolio' AND column_name = 'showPreview');
SET @sql := IF(@exist = 0, 'ALTER TABLE portfolio ADD COLUMN showPreview BOOLEAN NOT NULL DEFAULT false', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
