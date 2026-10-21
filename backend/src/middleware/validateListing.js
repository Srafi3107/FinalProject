// Allowed Dhaka Areas per project guidelines
const DHAKA_AREAS = [
  'Mirpur', 'Dhanmondi', 'Uttara', 'Mohammadpur', 'Banani',
  'Gulshan', 'Bashundhara', 'Badda', 'Rampura', 'Motijheel'
];

/**
 * Validation Middleware for Creating & Updating Listings
 */
const validateListing = (req, res, next) => {
  const {
    title,
    area,
    address,
    rent,
    bedrooms,
    bathrooms,
    sizeSqft,
    size, // accept both size and sizeSqft for frontend flexibility
    furnished,
    genderAllowed
  } = req.body;

  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push('Title is required (minimum 5 characters).');
  }

  // Area validation (must be valid Dhaka area)
  if (!area || !DHAKA_AREAS.includes(area.trim())) {
    errors.push(`Valid Dhaka area is required: ${DHAKA_AREAS.join(', ')}.`);
  }

  // Address validation
  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    errors.push('Street address is required (minimum 5 characters).');
  }

  // Rent validation
  const parsedRent = Number(rent);
  if (isNaN(parsedRent) || parsedRent < 1000) {
    errors.push('Monthly rent must be a valid amount of at least ৳1,000.');
  }

  // Bedrooms & Bathrooms
  if (bedrooms !== undefined && (isNaN(Number(bedrooms)) || Number(bedrooms) < 1)) {
    errors.push('Bedrooms must be a positive integer.');
  }
  if (bathrooms !== undefined && (isNaN(Number(bathrooms)) || Number(bathrooms) < 1)) {
    errors.push('Bathrooms must be a positive integer.');
  }

  // Size in sqft
  const flatSize = Number(sizeSqft || size);
  if (isNaN(flatSize) || flatSize < 50) {
    errors.push('Size must be at least 50 sqft.');
  }

  // Furnished enum
  if (furnished && !['Furnished', 'Semi-Furnished', 'Unfurnished'].includes(furnished)) {
    errors.push("Furnishing status must be 'Furnished', 'Semi-Furnished', or 'Unfurnished'.");
  }

  // Gender enum
  if (genderAllowed && !['any', 'male', 'female'].includes(genderAllowed)) {
    errors.push("Gender allowed must be 'any', 'male', or 'female'.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  // Normalize parsed values onto req.body
  req.body.title = title.trim();
  req.body.area = area.trim();
  req.body.address = address.trim();
  req.body.rent = parsedRent;
  req.body.sizeSqft = flatSize;

  next();
};

module.exports = {
  validateListing,
  DHAKA_AREAS
};
