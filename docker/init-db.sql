-- VibePass 10/10 Microservices Database Initialization Script
CREATE DATABASE IF NOT EXISTS vibepass_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS vibepass_matching CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS vibepass_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS vibepass_safety CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS facebook_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON vibepass_auth.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON vibepass_matching.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON vibepass_social.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON vibepass_safety.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON facebook_clone.* TO 'root'@'%';
FLUSH PRIVILEGES;

