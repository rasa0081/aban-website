SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
  WHERE table_schema = DATABASE() AND table_name = 'articles' AND column_name = 'slug');
SET @sql := IF(@exist = 0, 'ALTER TABLE articles ADD COLUMN slug VARCHAR(500) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
