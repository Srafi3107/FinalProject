import React, { useState } from 'react';
import { DHAKA_AREAS } from '../../data/mockData';
import Button from '../common/Button';
import Input from '../common/Input';

const EditListingModal = ({ listing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    ...listing,
    tenantType: listing.tenantType || ['bachelor']
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Title cannot be empty.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSave({
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size)
      });
      onClose();
    }, 400);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Listing #{listing.id}</h2>
            <p className="modal-sub">Update property details, pricing, and availability.</p>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-scroll dashboard-form">
          <Input
            label="Listing Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            required
          />

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Dhaka Area</label>
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
              label="Monthly Rent (BDT)"
              name="rent"
              type="number"
              value={formData.rent}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="1">1 Bed</option>
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
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                name="isAvailable"
                value={formData.isAvailable ? 'true' : 'false'}
                onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.value === 'true' }))}
                className="form-select"
              >
                <option value="true">🟢 Available for Rent</option>
                <option value="false">⚪ Rented Out</option>
              </select>
            </div>
          </div>

          {/* Facilities */}
          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div className="checkbox-pills-row">
              <label className={`checkbox-pill ${formData.hasWifi ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="hasWifi"
                  checked={formData.hasWifi}
                  onChange={handleInputChange}
                />
                <span>📶 WiFi</span>
              </label>

              <label className={`checkbox-pill ${formData.hasGas ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="hasGas"
                  checked={formData.hasGas}
                  onChange={handleInputChange}
                />
                <span>🔥 Gas</span>
              </label>

              <label className={`checkbox-pill ${formData.hasLift ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="hasLift"
                  checked={formData.hasLift}
                  onChange={handleInputChange}
                />
                <span>🛗 Lift</span>
              </label>
            </div>
          </div>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="upload-options-row">
              <label className="file-upload-btn btn btn-outline btn-sm">
                📁 Upload Photo
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
                  placeholder="Or paste image URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="url-input"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddImageUrl}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="image-previews-grid" style={{ marginTop: '0.75rem' }}>
              {formData.images.map((imgSrc, idx) => (
                <div key={idx} className="preview-thumb-card">
                  <img src={imgSrc} alt={`Edit preview ${idx + 1}`} />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-textarea"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;
