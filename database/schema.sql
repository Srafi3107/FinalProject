-- ============================================================================
-- HomeMatch Database Schema
-- AI-powered Housing & Roommate Matching Platform for Dhaka, Bangladesh
-- Target RDBMS: MySQL 8.0+
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `homematch_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `homematch_db`;

-- ----------------------------------------------------------------------------
-- 1. Users Table
-- Roles: 'tenant', 'owner', 'admin'
-- Verification: NID or Student ID upload gives a Verified badge
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` ENUM('tenant', 'owner', 'admin') NOT NULL DEFAULT 'tenant',
  `avatar` VARCHAR(255) NULL,
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `verification_doc_type` ENUM('nid', 'student_id') NULL,
  `verification_doc_number` VARCHAR(50) NULL,
  `verification_doc_url` VARCHAR(255) NULL,
  `is_blocked` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_is_verified` (`is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Tenant Profiles Table
-- Housing needs + lifestyle habits (5 weighted AI compatibility factors)
-- AI Weights: smoking 0.30, cleanliness 0.25, sleep 0.20, budget 0.15, cooking 0.10
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenant_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `age` TINYINT UNSIGNED NULL,
  `gender` ENUM('male', 'female', 'other') NOT NULL DEFAULT 'male',
  `occupation` VARCHAR(100) NULL,
  `institution` VARCHAR(150) NULL,
  `bio` TEXT NULL,
  -- Housing needs
  `target_budget` INT UNSIGNED NOT NULL DEFAULT 15000,
  `preferred_areas` JSON NULL, -- JSON array of Dhaka areas: ["Mirpur", "Dhanmondi"]
  `room_type` ENUM('flat', 'bachelor', 'seat') NOT NULL DEFAULT 'bachelor',
  `furnished_preference` ENUM('Any', 'Furnished', 'Semi-Furnished', 'Unfurnished') NOT NULL DEFAULT 'Any',
  `wifi_required` BOOLEAN NOT NULL DEFAULT TRUE,
  `gas_required` BOOLEAN NOT NULL DEFAULT TRUE,
  `lift_required` BOOLEAN NOT NULL DEFAULT FALSE,
  `move_in_date` DATE NULL,
  -- Lifestyle habits (AI features)
  `smoking` ENUM('non_smoker', 'smoker', 'occasional') NOT NULL DEFAULT 'non_smoker',
  `cleanliness` TINYINT UNSIGNED NOT NULL DEFAULT 5, -- 1 to 5 scale
  `sleep_time` ENUM('early', 'normal', 'night_owl') NOT NULL DEFAULT 'normal',
  `cooking_frequency` ENUM('none', 'occasional', 'daily') NOT NULL DEFAULT 'daily',
  `guests_policy` ENUM('no_guests', 'weekends_only', 'flexible') NOT NULL DEFAULT 'weekends_only',
  `gender_preference` ENUM('male', 'female', 'any') NOT NULL DEFAULT 'male',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tenant_user_id` (`user_id`),
  KEY `idx_tenant_budget` (`target_budget`),
  KEY `idx_tenant_smoking` (`smoking`),
  KEY `idx_tenant_cleanliness` (`cleanliness`),
  CONSTRAINT `fk_tenant_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Listings Table
-- Property owners post, edit, delete listings
-- Tenant types: bachelor, family, student, job_holder (stored as JSON array)
-- Status: available, rented, pending_approval, rejected
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `listings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `area` VARCHAR(50) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `rent` INT UNSIGNED NOT NULL,
  `service_charge` INT UNSIGNED NOT NULL DEFAULT 0,
  `deposit_months` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  `bedrooms` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `bathrooms` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `size_sqft` INT UNSIGNED NOT NULL,
  `furnished` ENUM('Furnished', 'Semi-Furnished', 'Unfurnished') NOT NULL DEFAULT 'Unfurnished',
  `has_wifi` BOOLEAN NOT NULL DEFAULT FALSE,
  `has_gas` BOOLEAN NOT NULL DEFAULT TRUE,
  `has_lift` BOOLEAN NOT NULL DEFAULT FALSE,
  `has_generator` BOOLEAN NOT NULL DEFAULT FALSE,
  `tenant_type` JSON NOT NULL, -- e.g. ["bachelor", "student", "job_holder"]
  `gender_allowed` ENUM('any', 'male', 'female') NOT NULL DEFAULT 'any',
  `description` TEXT NULL,
  `status` ENUM('available', 'rented', 'pending_approval', 'rejected') NOT NULL DEFAULT 'available',
  `is_approved` BOOLEAN NOT NULL DEFAULT TRUE,
  `predicted_rent` INT UNSIGNED NULL, -- Populated by FastAPI rent prediction model
  `is_overpriced` BOOLEAN NOT NULL DEFAULT FALSE, -- Listed rent > predicted rent by 25%
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_listings_owner` (`owner_id`),
  KEY `idx_listings_area` (`area`),
  KEY `idx_listings_rent` (`rent`),
  KEY `idx_listings_bedrooms` (`bedrooms`),
  KEY `idx_listings_status` (`status`),
  CONSTRAINT `fk_listings_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Listing Images Table
-- Stores multiple photo URLs per listing with cover photo indicator
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `listing_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_cover` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_images_listing` (`listing_id`),
  CONSTRAINT `fk_images_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Roommate Requests Table
-- Roommate matching: send, accept, reject. Accepted pairs become matched roommates.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roommate_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `message` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roommate_pair` (`sender_id`, `receiver_id`),
  KEY `idx_roommate_receiver` (`receiver_id`),
  KEY `idx_roommate_status` (`status`),
  CONSTRAINT `fk_roommate_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_roommate_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Visit & Rent Requests Table
-- Tenant schedules flat visit or sends rent inquiry to property owner
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` INT UNSIGNED NOT NULL,
  `tenant_id` INT UNSIGNED NOT NULL,
  `type` ENUM('visit', 'rent') NOT NULL DEFAULT 'visit',
  `target_date` DATE NULL,
  `preferred_slot` VARCHAR(100) NULL, -- e.g. "Afternoon (3:00 PM - 5:00 PM)"
  `number_of_visitors` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `offer_rent` INT UNSIGNED NULL, -- Used when type = 'rent'
  `message` TEXT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_requests_listing` (`listing_id`),
  KEY `idx_requests_tenant` (`tenant_id`),
  KEY `idx_requests_status` (`status`),
  CONSTRAINT `fk_requests_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_requests_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Favorites Table
-- Tenants bookmark favorite listings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `listing_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_favorite` (`user_id`, `listing_id`),
  KEY `idx_favorites_user` (`user_id`),
  KEY `idx_favorites_listing` (`listing_id`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorites_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Reviews Table
-- Ratings & reviews for houses and property owners
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT NOT NULL,
  `pros` VARCHAR(255) NULL,
  `cons` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_listing` (`listing_id`),
  KEY `idx_reviews_user` (`user_id`),
  CONSTRAINT `fk_reviews_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Reports Table
-- Reports against users or listings for admin moderation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reporter_id` INT UNSIGNED NOT NULL,
  `reported_type` ENUM('listing', 'user') NOT NULL,
  `target_id` INT UNSIGNED NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT NULL,
  `status` ENUM('pending', 'resolved', 'dismissed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reports_reporter` (`reporter_id`),
  KEY `idx_reports_status` (`status`),
  CONSTRAINT `fk_reports_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Market Listings Table (Supervisor Requirement)
-- Cleaned scraped rental market data from Bikroy, bdHousing, Rents.com.bd
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `market_listings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(50) NOT NULL, -- 'Bikroy.com', 'bdHousing.com', 'Rents.com.bd'
  `title` VARCHAR(255) NOT NULL,
  `area` VARCHAR(50) NOT NULL,
  `rent` INT UNSIGNED NOT NULL,
  `bedrooms` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `bathrooms` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `size_sqft` INT UNSIGNED NULL,
  `furnished` ENUM('Furnished', 'Semi-Furnished', 'Unfurnished') NOT NULL DEFAULT 'Unfurnished',
  `listing_url` VARCHAR(255) NULL,
  `scraped_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_market_area` (`area`),
  KEY `idx_market_source` (`source`),
  KEY `idx_market_rent` (`rent`),
  KEY `idx_market_bedrooms` (`bedrooms`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
