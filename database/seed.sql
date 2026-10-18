-- ============================================================================
-- HomeMatch Seed Data — Realistic Dhaka Urban Housing & Users
-- Target RDBMS: MySQL 8.0+
-- Default Demo Password for all seeded users: "password123"
-- Bcrypt Hash: $2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u
-- ============================================================================

USE `homematch_db`;

-- Disable Foreign Key checks temporarily for clean truncation/insertion
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `reports`;
TRUNCATE TABLE `reviews`;
TRUNCATE TABLE `favorites`;
TRUNCATE TABLE `property_requests`;
TRUNCATE TABLE `roommate_requests`;
TRUNCATE TABLE `listing_images`;
TRUNCATE TABLE `listings`;
TRUNCATE TABLE `tenant_profiles`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `market_listings`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Seed Users (Tenants, Owners, Admin)
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `avatar`, `is_verified`, `verification_doc_type`, `verification_doc_number`, `created_at`) VALUES
-- Admin User
(1, 'System Administrator', 'admin@homematch.bd', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01700000000', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', TRUE, 'nid', '19901234567890123', NOW()),

-- Tenants
(2, 'Tanvir Ahmed', 'tanvir@homematch.bd', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01712345678', 'tenant', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', TRUE, 'student_id', 'NSU-2121345', NOW()),
(3, 'Sazzad Hossain', 'sazzad@bracu.ac.bd', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01811223344', 'tenant', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', TRUE, 'student_id', 'BRACU-20301122', NOW()),
(4, 'Mahir Faisal', 'mahir@brainstation-23.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01999887766', 'tenant', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', TRUE, 'nid', '19985678901234567', NOW()),
(5, 'Nabila Rahman', 'nabila@nsu.edu', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01611223344', 'tenant', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', TRUE, 'student_id', 'NSU-2210456', NOW()),
(6, 'Zubair Hossain', 'zubair@du.ac.bd', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01511223344', 'tenant', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400', FALSE, NULL, NULL, NOW()),

-- Property Owners
(7, 'Engr. Mofazzal Hossain', 'mofazzal@gmail.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01711223344', 'owner', NULL, TRUE, 'nid', '19651234567890123', NOW()),
(8, 'Dr. Shahedur Rahman', 'shahedur@gmail.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01819988776', 'owner', NULL, TRUE, 'nid', '19701234567890456', NOW()),
(9, 'Kazi Nazrul Islam', 'nazrul.property@gmail.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01912233445', 'owner', NULL, TRUE, 'nid', '19751234567890789', NOW()),
(10, 'Farhana Akhter', 'farhana.bashundhara@gmail.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01671122334', 'owner', NULL, TRUE, 'nid', '19821234567890987', NOW()),
(11, 'Abdul Malek', 'malek@gmail.com', '$2b$10$t4hS3Aio6xzDlwW6mzmw7uE8YOXIZWPoPBJzJiLfSx12bRKXV3N3u', '01815544332', 'owner', NULL, FALSE, NULL, NULL, NOW());

-- ----------------------------------------------------------------------------
-- 2. Seed Tenant Profiles (Preferences + 5 Weighted Lifestyle AI factors)
-- ----------------------------------------------------------------------------
INSERT INTO `tenant_profiles` (`user_id`, `age`, `gender`, `occupation`, `institution`, `bio`, `target_budget`, `preferred_areas`, `room_type`, `furnished_preference`, `wifi_required`, `gas_required`, `lift_required`, `smoking`, `cleanliness`, `sleep_time`, `cooking_frequency`, `guests_policy`, `gender_preference`) VALUES
(2, 22, 'male', 'CS Student @ NSU', 'North South University', 'Final year CS student. Neat, organized, and focused on study/thesis. Looking for quiet flatmates in Mirpur or Dhanmondi.', 15000, '["Mirpur", "Dhanmondi", "Mohammadpur"]', 'bachelor', 'Furnished', TRUE, TRUE, TRUE, 'non_smoker', 5, 'normal', 'daily', 'weekends_only', 'male'),
(3, 23, 'male', 'Student @ BRAC University', 'BRACU (CSE)', 'Coding enthusiast. Prefer a neat environment with minimal noise during exam weeks.', 12000, '["Mirpur", "Mohammadpur", "Dhanmondi"]', 'bachelor', 'Semi-Furnished', TRUE, TRUE, FALSE, 'non_smoker', 5, 'normal', 'occasional', 'weekends_only', 'male'),
(4, 25, 'male', 'Junior Software Engineer', 'Brain Station 23', 'Full-stack developer working hybrid. Quiet, tidy, and cooks breakfast and dinner at home.', 16000, '["Mirpur", "Banani", "Uttara"]', 'bachelor', 'Any', TRUE, TRUE, TRUE, 'non_smoker', 4, 'night_owl', 'daily', 'weekends_only', 'male'),
(5, 21, 'female', 'Undergrad Student @ NSU', 'North South University', 'Studying BBA. Looking for female roommates who value hygiene and peaceful study environment.', 14000, '["Bashundhara", "Badda"]', 'seat', 'Furnished', TRUE, TRUE, TRUE, 'non_smoker', 5, 'early', 'occasional', 'no_guests', 'female'),
(6, 24, 'male', 'Masters Student @ DU', 'Dhaka University', 'Casual student, enjoys weekend gaming and movie nights.', 10000, '["Mohammadpur", "Rampura"]', 'seat', 'Unfurnished', TRUE, TRUE, FALSE, 'occasional', 3, 'night_owl', 'none', 'flexible', 'male');

-- ----------------------------------------------------------------------------
-- 3. Seed Property Listings
-- ----------------------------------------------------------------------------
INSERT INTO `listings` (`id`, `owner_id`, `title`, `area`, `address`, `rent`, `service_charge`, `deposit_months`, `bedrooms`, `bathrooms`, `size_sqft`, `furnished`, `has_wifi`, `has_gas`, `has_lift`, `has_generator`, `tenant_type`, `gender_allowed`, `description`, `status`, `is_approved`, `predicted_rent`, `is_overpriced`) VALUES
(1, 7, 'Sunny 3-Bed Family/Bachelor Flat near Metro Station', 'Mirpur', 'Mirpur-12, Block-C, Near MRT Line-6 Station', 22000, 3500, 2, 3, 2, 1250, 'Semi-Furnished', TRUE, TRUE, TRUE, TRUE, '["bachelor", "family", "job_holder"]', 'any', 'Spacious 3-bedroom apartment with great cross-ventilation and natural daylight. Walking distance to Mirpur-12 Metro Rail Station.', 'available', TRUE, 21500, FALSE),
(2, 8, 'Furnished Bachelor Room Sublet with Attached Balcony', 'Dhanmondi', 'Road 9/A, Near State University & Star Kabab', 9500, 1200, 1, 1, 1, 280, 'Furnished', TRUE, TRUE, FALSE, FALSE, '["bachelor", "student"]', 'male', 'Single master bed sublet room for male student or executive. Attached washroom and personal south-facing balcony.', 'available', TRUE, 10000, FALSE),
(3, 9, 'Modern 3-Bed Family Apartment in Sector 11', 'Uttara', 'Sector 11, Road 4, Near Milestone College', 32000, 4000, 2, 3, 3, 1500, 'Unfurnished', TRUE, TRUE, TRUE, TRUE, '["family"]', 'any', 'Brand new contemporary flat with 3 large bedrooms and attached balconies. Intercom, designated car parking, and generator.', 'available', TRUE, 31000, FALSE),
(4, 10, 'Female Student Sublet Seat near NSU & IUB', 'Bashundhara', 'Block-D, Road 4, Walking distance to NSU Campus', 7500, 1500, 1, 1, 1, 220, 'Furnished', TRUE, TRUE, TRUE, TRUE, '["student"]', 'female', 'Exclusive seat for female university students. 24/7 security guard, biometric entry, shared refrigerator, and microwave.', 'available', TRUE, 7800, FALSE),
(5, 11, 'Affordable 2-Bed Bachelor Mess Flat', 'Mohammadpur', 'Katasur, Near Mohammadpur Bus Stand', 16000, 1800, 2, 2, 2, 850, 'Unfurnished', TRUE, TRUE, FALSE, FALSE, '["bachelor", "student"]', 'male', 'Budget-friendly 2-bedroom flat ideal for 3-4 bachelor students or job holders. Line gas available.', 'available', TRUE, 15500, FALSE);

-- ----------------------------------------------------------------------------
-- 4. Seed Listing Images
-- ----------------------------------------------------------------------------
INSERT INTO `listing_images` (`listing_id`, `image_url`, `is_cover`) VALUES
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', TRUE),
(1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', FALSE),
(2, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', TRUE),
(3, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', TRUE),
(4, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', TRUE),
(5, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', TRUE);

-- ----------------------------------------------------------------------------
-- 5. Seed Property Requests (Visits & Rent Requests)
-- ----------------------------------------------------------------------------
INSERT INTO `property_requests` (`id`, `listing_id`, `tenant_id`, `type`, `target_date`, `preferred_slot`, `number_of_visitors`, `offer_rent`, `message`, `status`) VALUES
(1, 1, 2, 'visit', '2026-10-25', 'Afternoon (3:00 PM - 5:00 PM)', 2, NULL, 'Hello, I want to visit the flat with my university classmate.', 'pending'),
(2, 1, 3, 'rent', NULL, NULL, 1, 22000, 'We inspected the flat and want to confirm rent starting next month.', 'accepted'),
(3, 2, 6, 'rent', NULL, NULL, 1, 9000, 'Looking for sublet seat from 1st November.', 'rejected');

-- ----------------------------------------------------------------------------
-- 6. Seed Roommate Requests (Connections between Tenants)
-- ----------------------------------------------------------------------------
INSERT INTO `roommate_requests` (`sender_id`, `receiver_id`, `status`, `message`) VALUES
(2, 3, 'accepted', 'Hi Sazzad, saw your profile matches 96% with mine for Mirpur. Let us team up!'),
(2, 4, 'pending', 'Hey Mahir, interested in sharing a 2-bed apartment in Mirpur?');

-- ----------------------------------------------------------------------------
-- 7. Seed Reviews
-- ----------------------------------------------------------------------------
INSERT INTO `reviews` (`listing_id`, `user_id`, `rating`, `comment`, `pros`, `cons`) VALUES
(1, 2, 5, 'Lived here for 8 months during semester. Very calm location near Mirpur-10 metro station. Landlord is very supportive.', 'Near Metro, continuous line gas, friendly landlord', 'Night gate locks at 11:30 PM'),
(1, 4, 4, 'Great internet connectivity and DESCO electricity rarely dropped. Lift always operational.', 'Lift working 24/7, high speed fiber optic', 'Service charge went up slightly'),
(4, 5, 5, 'Best female sublet in Bashundhara Block D. Safe biometric entry and walking distance to campus.', 'Biometric gate, zero brokerage, friendly flatmates', 'Visitor curfew applies');

-- ----------------------------------------------------------------------------
-- 8. Seed Scraped Market Listings (Supervisor Dashboard Requirement)
-- ----------------------------------------------------------------------------
INSERT INTO `market_listings` (`source`, `title`, `area`, `rent`, `bedrooms`, `bathrooms`, `size_sqft`, `furnished`, `listing_url`) VALUES
('Bikroy.com', '3 Bed Family Flat in Mirpur 12', 'Mirpur', 18500, 3, 2, 1200, 'Unfurnished', 'https://bikroy.com/bn/ad/flat-for-rent-mirpur-dhaka'),
('bdHousing.com', '2 Bed Apartment for Rent in Dhanmondi', 'Dhanmondi', 32000, 2, 2, 1100, 'Semi-Furnished', 'https://bdhousing.com/details/dhanmondi-flat-2bed'),
('Rents.com.bd', 'Luxury 3 Bed Apartment in Uttara Sector 11', 'Uttara', 26500, 3, 3, 1450, 'Furnished', 'https://rents.com.bd/property/uttara-sector11'),
('Bikroy.com', 'Bachelor Sublet Seat in Bashundhara R/A', 'Bashundhara', 7500, 1, 1, 220, 'Furnished', 'https://bikroy.com/bn/ad/seat-rent-bashundhara'),
('bdHousing.com', 'Affordable 2 Bed in Katasur Mohammadpur', 'Mohammadpur', 16000, 2, 1, 800, 'Unfurnished', 'https://bdhousing.com/details/mohammadpur-2bed'),
('Rents.com.bd', '4 Bed Luxury Apartment in Banani Block D', 'Banani', 54000, 4, 4, 2200, 'Furnished', 'https://rents.com.bd/property/banani-blockd');
