const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination upload folder exists
const uploadDir = path.join(__dirname, '../../uploads/listings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, unique filename: listing-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `listing-${uniqueSuffix}${ext}`);
  }
});

// File Filter: accept images only (JPEG, PNG, WebP)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only image files (JPEG, PNG, WebP) are allowed.');
    error.statusCode = 400;
    cb(error, false);
  }
};

// Multer Upload Instance: max 5 images, max 5MB per file
const uploadListingPhotos = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // max 5 photos per listing
  }
}).array('photos', 5);

module.exports = {
  uploadListingPhotos
};
