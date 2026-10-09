import React, { useState } from 'react';
import { DHAKA_AREAS } from '../../data/mockData';
import Button from '../common/Button';
import Input from '../common/Input';

const AddListingForm = ({ onAddListing, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    area: 'Mirpur',
    address: '',
    rent: '',
    serviceCharge: '',
    bedrooms: 2,
    bathrooms: 2,
    size: 1000,
    furnished: 'Semi-Furnished',
    hasWifi: true,
    hasGas: true,
    hasLift: true,
    hasGenerator: false,
    tenantType: ['bachelor', 'student'],
    genderAllowed: 'any',
    description: '',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
    ]
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleTenantTypeToggle = (type) => {
    setFormData((prev) => {
      const exists = prev.tenantType.includes(type);
      const updated = exists
        ? prev.tenantType.filter((t) => t !== type)
        : [...prev.tenantType, type];
      return { ...prev, tenantType: updated };
    });
  };

  // Image upload simulation with FileReader (Task 4)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.address.trim()) errs.address = 'Specific address is required.';
    if (!formData.rent || Number(formData.rent) <= 0) errs.rent = 'Valid monthly rent is required.';
    if (formData.tenantType.length === 0) errs.tenantType = 'Select at least one allowed tenant category.';
    if (formData.images.length === 0) errs.images = 'Please provide at least one photo.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAddListing({
        ...formData,
        id: Date.now(),
        rent: Number(formData.rent),
        serviceCharge: Number(formData.serviceCharge || 0),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
        isAvailable: true,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }, 500);
  };

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Add New Property Listing</h2>
          <p className="card-desc">
            Post an apartment, sublet room, or student mess flat for Dhaka tenants.
          </p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          ✕ Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-form" noValidate>
        {/* Title */}
        <Input
          label="Listing Title"
          name="title"
          placeholder="e.g. Sunny 3-Bed Flat near Mirpur-12 Metro Station"
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
          required
        />

        {/* Area & Address */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              Dhaka Area <span className="input-required-star">*</span>
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="form-select"
            >
              {DHAKA_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <Input
            label="Street / Block Address"
            name="address"
            placeholder="e.g. Block-C, Road 4, House 12"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            required
          />
        </div>

        {/* Rent & Service Charge */}
        <div className="form-row-2">
          <Input
            label="Monthly Rent (BDT)"
            name="rent"
            type="number"
            placeholder="e.g. 20000"
            value={formData.rent}
            onChange={handleInputChange}
            error={errors.rent}
            required
          />

          <Input
            label="Service Charge (BDT / month)"
            name="serviceCharge"
            type="number"
            placeholder="e.g. 3000 (Gas, water, guard)"
            value={formData.serviceCharge}
            onChange={handleInputChange}
          />
        </div>

        {/* Bed, Bath, Size, Furnished */}
        <div className="form-row-4">
          <div className="form-group">
            <label className="form-label">Bedrooms</label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="1">1 Bed (Sublet)</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bathrooms</label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="1">1 Bath</option>
              <option value="2">2 Baths</option>
              <option value="3">3 Baths</option>
              <option value="4">4 Baths</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Size (sqft)</label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g. 1100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Furnishing</label>
            <select
              name="furnished"
              value={formData.furnished}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        </div>

        {/* Facilities Checkboxes */}
        <div className="form-group">
          <label className="form-label">Available Facilities</label>
          <div className="checkbox-pills-row">
            <label className={`checkbox-pill ${formData.hasWifi ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="hasWifi"
                checked={formData.hasWifi}
                onChange={handleInputChange}
              />
              <span>📶 WiFi Internet</span>
            </label>

            <label className={`checkbox-pill ${formData.hasGas ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="hasGas"
                checked={formData.hasGas}
                onChange={handleInputChange}
              />
              <span>🔥 Gas Line Supply</span>
            </label>

            <label className={`checkbox-pill ${formData.hasLift ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="hasLift"
                checked={formData.hasLift}
                onChange={handleInputChange}
              />
              <span>🛗 Lift / Elevator</span>
            </label>

            <label className={`checkbox-pill ${formData.hasGenerator ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="hasGenerator"
                checked={formData.hasGenerator}
                onChange={handleInputChange}
              />
              <span>⚡ Generator Backup</span>
            </label>
          </div>
        </div>

        {/* Tenant Type & Gender Allowed */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              Allowed Tenant Categories <span className="input-required-star">*</span>
            </label>
            <div className="checkbox-pills-row">
              {['bachelor', 'family', 'student', 'job_holder'].map((type) => {
                const checked = formData.tenantType.includes(type);
                return (
                  <label key={type} className={`checkbox-pill ${checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTenantTypeToggle(type)}
                    />
                    <span>{type === 'job_holder' ? 'Job Holder' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                );
              })}
            </div>
            {errors.tenantType && <span className="field-error-text">{errors.tenantType}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Gender Restriction</label>
            <select
              name="genderAllowed"
              value={formData.genderAllowed}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="any">Any (Family / Male / Female)</option>
              <option value="male">Male Only (Bachelor / Students)</option>
              <option value="female">Female Only (Working Women / Female Students)</option>
            </select>
          </div>
        </div>

        {/* Task 4: Image Upload with Preview */}
        <div className="form-group">
          <label className="form-label">
            Property Photos <span className="input-required-star">*</span>
          </label>
          <div className="image-uploader-box">
            <div className="upload-options-row">
              <label className="file-upload-btn btn btn-outline btn-sm">
                📁 Upload from Device
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <div className="url-add-box">
                <input
                  type="url"
                  placeholder="Or paste image URL (Unsplash, etc.)..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="url-input"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddImageUrl}
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Thumbnail Preview Grid */}
            <div className="image-previews-grid">
              {formData.images.map((imgSrc, idx) => (
                <div key={idx} className="preview-thumb-card">
                  <img src={imgSrc} alt={`Property upload ${idx + 1}`} />
                  {idx === 0 && <span className="cover-badge">Cover Photo</span>}
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {errors.images && <span className="field-error-text">{errors.images}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Property Description &amp; House Rules</label>
          <textarea
            name="description"
            rows="4"
            className="form-textarea"
            placeholder="Describe room layout, nearby landmarks (metro, bus stop), utilities, and security deposit terms..."
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            Publish Property Listing
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddListingForm;
