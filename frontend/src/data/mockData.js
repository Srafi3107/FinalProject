// HomeMatch Mock Data — Realistic Dhaka Urban Housing Dataset
// Areas: Mirpur, Dhanmondi, Uttara, Mohammadpur, Banani, Gulshan, Bashundhara, Badda, Rampura, Motijheel

export const DHAKA_AREAS = [
  'Mirpur',
  'Dhanmondi',
  'Uttara',
  'Mohammadpur',
  'Banani',
  'Gulshan',
  'Bashundhara',
  'Badda',
  'Rampura',
  'Motijheel'
];

export const mockListings = [
  {
    id: 1,
    title: 'Sunny 3-Bed Family/Bachelor Flat near Metro Station',
    area: 'Mirpur',
    address: 'Mirpur-12, Block-C, Near MRT Line-6 Station',
    rent: 22000,
    bedrooms: 3,
    bathrooms: 2,
    size: 1250,
    furnished: 'Semi-Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['bachelor', 'family', 'job_holder'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 14,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Spacious 3-bedroom apartment with great cross-ventilation and natural daylight. Walking distance to Mirpur-12 Metro Rail Station. 24/7 gas supply and dedicated elevator.',
    owner: {
      id: 101,
      name: 'Engr. Mofazzal Hossain',
      phone: '01711223344',
      isVerified: true,
      memberSince: 'March 2024'
    },
    depositMonths: 2,
    serviceCharge: 3500,
    createdAt: '2026-09-28'
  },
  {
    id: 2,
    title: 'Furnished Bachelor Room Sublet with Attached Balcony',
    area: 'Dhanmondi',
    address: 'Road 9/A, Near State University & Star Kabab',
    rent: 9500,
    bedrooms: 1,
    bathrooms: 1,
    size: 260,
    furnished: 'Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: false,
    hasGenerator: false,
    tenantType: ['bachelor', 'student', 'job_holder'],
    genderAllowed: 'male',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 8,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Single bachelor room for university student or job holder. Includes single bed, study table, ceiling fan, and high-speed fiber WiFi. Cooking facility available in shared kitchen.',
    owner: {
      id: 102,
      name: 'Kamrul Hasan',
      phone: '01819876543',
      isVerified: true,
      memberSince: 'January 2024'
    },
    depositMonths: 1,
    serviceCharge: 1200,
    createdAt: '2026-10-01'
  },
  {
    id: 3,
    title: 'Modern 2-Bed Apartment with Lift & Full Generator',
    area: 'Uttara',
    address: 'Sector 11, Road 18, Uttara Model Town',
    rent: 28000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1100,
    furnished: 'Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['family', 'job_holder'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Modern European style finished apartment in peaceful Sector 11. Fully secured building with CCTV surveillance, card access lift, and full load generator backup.',
    owner: {
      id: 103,
      name: 'Begum Shamsunnahar',
      phone: '01912345678',
      isVerified: true,
      memberSince: 'May 2023'
    },
    depositMonths: 2,
    serviceCharge: 4000,
    createdAt: '2026-09-15'
  },
  {
    id: 4,
    title: 'Female Student Sublet Seat near NSU & IUB',
    area: 'Bashundhara',
    address: 'Block-D, Road 4, Walking distance to NSU Campus',
    rent: 7500,
    bedrooms: 1,
    bathrooms: 1,
    size: 220,
    furnished: 'Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['student'],
    genderAllowed: 'female',
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 11,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Exclusive seat for female university students (NSU/IUB/AIUB). 24/7 security guard, biometric entry, shared refrigerator, microwave, and high-speed internet.',
    owner: {
      id: 104,
      name: 'Farhana Akhter',
      phone: '01671122334',
      isVerified: true,
      memberSince: 'August 2024'
    },
    depositMonths: 1,
    serviceCharge: 1500,
    createdAt: '2026-10-02'
  },
  {
    id: 5,
    title: 'Spacious 4-Bed Luxury Flat in Prime Banani',
    area: 'Banani',
    address: 'Road 11, Block-F, Banani Diplomatic Area',
    rent: 55000,
    bedrooms: 4,
    bathrooms: 4,
    size: 2250,
    furnished: 'Semi-Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['family', 'job_holder'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Luxury flat with Italian marble tiles, dedicated parking slots, servant room with attached bath, intercom system, and close proximity to Kemal Ataturk Avenue.',
    owner: {
      id: 105,
      name: 'Barrister Rafiqul Islam',
      phone: '01715566778',
      isVerified: true,
      memberSince: 'November 2023'
    },
    depositMonths: 3,
    serviceCharge: 6500,
    createdAt: '2026-09-20'
  },
  {
    id: 6,
    title: 'Affordable 2-Bed Bachelor Mess Flat',
    area: 'Mohammadpur',
    address: 'Katasur, Near Mohammadpur Bus Stand',
    rent: 16000,
    bedrooms: 2,
    bathrooms: 2,
    size: 850,
    furnished: 'Unfurnished',
    hasWifi: true,
    hasGas: true,
    hasLift: false,
    hasGenerator: false,
    tenantType: ['bachelor', 'student'],
    genderAllowed: 'male',
    isAvailable: true,
    rating: 4.3,
    reviewsCount: 6,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Budget-friendly 2-bedroom flat ideal for 3-4 bachelor students or entry-level job holders. Line gas available. Very accessible to Mohammadpur and Ring Road.',
    owner: {
      id: 106,
      name: 'Abdul Malek',
      phone: '01815544332',
      isVerified: false,
      memberSince: 'June 2024'
    },
    depositMonths: 2,
    serviceCharge: 1800,
    createdAt: '2026-09-25'
  },
  {
    id: 7,
    title: 'Executive Studio Flat with Lake View',
    area: 'Gulshan',
    address: 'Gulshan-1, Road 23, Near Hatirjheel Link',
    rent: 38000,
    bedrooms: 1,
    bathrooms: 1,
    size: 650,
    furnished: 'Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['bachelor', 'job_holder'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee152478170c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Modern designer studio with panoramic lake views. Smart home lighting, AC included, modular kitchenette, and 24-hour concierge service. Great for corporate executives.',
    owner: {
      id: 107,
      name: 'Shahidul Alam',
      phone: '01718899001',
      isVerified: true,
      memberSince: 'December 2023'
    },
    depositMonths: 2,
    serviceCharge: 5000,
    createdAt: '2026-10-03'
  },
  {
    id: 8,
    title: 'Quiet 3-Bed Family Flat with Balcony Garden',
    area: 'Rampura',
    address: 'Banasree, Block-E, Road 6',
    rent: 23000,
    bedrooms: 3,
    bathrooms: 3,
    size: 1350,
    furnished: 'Unfurnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: false,
    tenantType: ['family'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.6,
    reviewsCount: 9,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Calm residential location in Banasree. Broad roads, 2 south-facing balconies, wide drawing-dining space. Pipeline Titas gas and round-the-clock water supply.',
    owner: {
      id: 108,
      name: 'Dr. Nurul Huda',
      phone: '01917766554',
      isVerified: true,
      memberSince: 'February 2024'
    },
    depositMonths: 2,
    serviceCharge: 3000,
    createdAt: '2026-09-18'
  },
  {
    id: 9,
    title: 'Bachelor Sublet Room near Canadian University',
    area: 'Badda',
    address: 'Middle Badda, Near Pragati Sarani',
    rent: 8000,
    bedrooms: 1,
    bathrooms: 1,
    size: 210,
    furnished: 'Semi-Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: false,
    hasGenerator: false,
    tenantType: ['bachelor', 'student'],
    genderAllowed: 'male',
    isAvailable: true,
    rating: 4.2,
    reviewsCount: 5,
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Convenient sublet room for students or office workers. Quick bus access along Pragati Sarani connecting Rampura, Kuril, and Notun Bazar.',
    owner: {
      id: 109,
      name: 'Zahid Hasan',
      phone: '01814433221',
      isVerified: false,
      memberSince: 'July 2024'
    },
    depositMonths: 1,
    serviceCharge: 1000,
    createdAt: '2026-09-29'
  },
  {
    id: 10,
    title: 'Corporate 3-Bed Flat near Commercial Hub',
    area: 'Motijheel',
    address: 'Near Dilkusha & Shapla Chottor',
    rent: 32000,
    bedrooms: 3,
    bathrooms: 2,
    size: 1400,
    furnished: 'Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: true,
    tenantType: ['family', 'job_holder'],
    genderAllowed: 'any',
    isAvailable: true,
    rating: 4.5,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ideal residence for bank officers and commercial professionals working in Motijheel and Dilkusha. 5 minutes from Motijheel Metro station.',
    owner: {
      id: 110,
      name: 'Mustafizur Rahman',
      phone: '01713322110',
      isVerified: true,
      memberSince: 'April 2024'
    },
    depositMonths: 2,
    serviceCharge: 4500,
    createdAt: '2026-09-22'
  }
];

// Current Demo Tenant User Profile
export const defaultTenantProfile = {
  id: 1,
  name: 'Tanvir Ahmed',
  email: 'tanvir@homematch.bd',
  phone: '01712345678',
  role: 'tenant',
  isVerified: true,
  university: 'North South University (NSU)',
  occupation: 'Undergrad Student (Computer Science)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'CS student at NSU. Very neat and organized. Looking for quiet roommates in Mirpur or Dhanmondi who respect sleep schedules.',
  // Housing Needs
  housingPreferences: {
    targetBudget: 15000,
    preferredAreas: ['Mirpur', 'Dhanmondi', 'Mohammadpur'],
    roomType: 'bachelor', // 'flat', 'bachelor', 'seat'
    furnished: 'Furnished',
    wifiRequired: true,
    gasRequired: true,
    liftRequired: true,
    moveInDate: '2026-11-01'
  },
  // Lifestyle Habits (AI Features)
  lifestyleHabits: {
    smoking: 'non_smoker', // 'non_smoker', 'smoker', 'occasional'
    cleanliness: 5, // 1 to 5 scale
    sleepTime: 'normal', // 'early' (before 11pm), 'normal' (11pm-1am), 'night_owl' (after 1am)
    cookingFrequency: 'daily', // 'none', 'occasional', 'daily'
    guestsPolicy: 'weekends_only', // 'no_guests', 'weekends_only', 'flexible'
    genderPreference: 'male' // 'male', 'female', 'any'
  }
};

// Realistic Dhaka Roommate Candidates for AI Matching
export const mockRoommates = [
  {
    id: 201,
    name: 'Sazzad Hossain',
    age: 23,
    gender: 'male',
    occupation: 'Student @ BRAC University',
    institution: 'BRACU (CSE)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Mirpur', 'Mohammadpur', 'Dhanmondi'],
    budget: 12000,
    isVerified: true,
    bio: 'Coding enthusiast and final year student. Prefer a neat environment with minimal noise during exam weeks.',
    // Lifestyle attributes
    smoking: 'non_smoker',
    cleanliness: 5,
    sleepTime: 'normal',
    cookingFrequency: 'occasional',
    guestsPolicy: 'weekends_only',
    // AI Match computation for defaultTenant
    matchScore: 96,
    reasons: [
      'Both strict non-smokers (30% weight)',
      'Identical cleanliness level: 5/5 (25% weight)',
      'Both sleep between 11 PM - 1 AM (20% weight)',
      'Compatible shared budget in Mirpur'
    ]
  },
  {
    id: 202,
    name: 'Mahir Faisal',
    age: 25,
    gender: 'male',
    occupation: 'Junior Software Engineer',
    institution: 'Brain Station 23',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Mirpur', 'Banani', 'Uttara'],
    budget: 16000,
    isVerified: true,
    bio: 'Full-stack developer working hybrid. Quiet, tidy, and cooks breakfast and dinner at home.',
    smoking: 'non_smoker',
    cleanliness: 4,
    sleepTime: 'night_owl',
    cookingFrequency: 'daily',
    guestsPolicy: 'weekends_only',
    matchScore: 89,
    reasons: [
      'Both non-smokers (30% weight)',
      'High cleanliness alignment: 4/5 vs 5/5',
      'Both cook at home regularly',
      'Within similar Mirpur budget range'
    ]
  },
  {
    id: 203,
    name: 'Anika Tabassum',
    age: 22,
    gender: 'female',
    occupation: 'BBA Student @ NSU',
    institution: 'North South University',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Bashundhara', 'Badda'],
    budget: 10000,
    isVerified: true,
    bio: 'Studious 3rd year student. Non-smoker, early riser, loves keeping common spaces spick and span.',
    smoking: 'non_smoker',
    cleanliness: 5,
    sleepTime: 'early',
    cookingFrequency: 'daily',
    guestsPolicy: 'no_guests',
    matchScore: 92,
    reasons: [
      'Both non-smokers (30% weight)',
      'Top cleanliness score: 5/5 (25% weight)',
      'Compatible student living budget',
      'Common preference for quiet study hours'
    ]
  },
  {
    id: 204,
    name: 'Zubair Rahman',
    age: 24,
    gender: 'male',
    occupation: 'Accounting Student @ Dhaka University',
    institution: 'University of Dhaka',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Dhanmondi', 'Mohammadpur', 'Motijheel'],
    budget: 9000,
    isVerified: false,
    bio: 'Passionate about sports and debate. Looking for shared room or flat sublet near Nilkhet/Dhanmondi.',
    smoking: 'non_smoker',
    cleanliness: 3,
    sleepTime: 'normal',
    cookingFrequency: 'none',
    guestsPolicy: 'flexible',
    matchScore: 78,
    reasons: [
      'Both non-smokers (30% weight)',
      'Matching sleep schedule (11 PM - 1 AM)',
      'Dhanmondi area overlap'
    ]
  },
  {
    id: 205,
    name: 'Nusrat Jahan',
    age: 24,
    gender: 'female',
    occupation: 'Digital Marketer',
    institution: 'Agency @ Banani',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Banani', 'Gulshan', 'Bashundhara'],
    budget: 18000,
    isVerified: true,
    bio: 'Working professional in advertising. Friendly, tidy, and loves sharing weekend cooking.',
    smoking: 'non_smoker',
    cleanliness: 4,
    sleepTime: 'normal',
    cookingFrequency: 'occasional',
    guestsPolicy: 'weekends_only',
    matchScore: 85,
    reasons: [
      'Both non-smokers (30% weight)',
      'Cleanliness alignment: 4/5',
      'Compatible peaceful weekend schedule'
    ]
  },
  {
    id: 206,
    name: 'Rashedul Karim',
    age: 26,
    gender: 'male',
    occupation: 'Bank Officer',
    institution: 'City Bank Ltd',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    preferredAreas: ['Motijheel', 'Rampura', 'Dhanmondi'],
    budget: 14000,
    isVerified: true,
    bio: 'Corporate banker. Disciplined schedule, early sleeper, non-smoker, looking for clean apartment mate.',
    smoking: 'non_smoker',
    cleanliness: 4,
    sleepTime: 'early',
    cookingFrequency: 'none',
    guestsPolicy: 'no_guests',
    matchScore: 81,
    reasons: [
      'Both non-smokers (30% weight)',
      'High cleanliness habit: 4/5',
      'Dhanmondi area match'
    ]
  }
];

