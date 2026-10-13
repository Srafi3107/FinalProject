import React, { useState } from 'react';
import './VisitModal.css';

const VisitModal = ({ isOpen, onClose, listing, onScheduled }) => {
  // Available time slots suitable for Dhaka traffic & prayers
  const TIME_SLOTS = [
    '10:30 AM - 11:30 AM (Morning)',
    '02:30 PM - 03:30 PM (Afternoon)',
    '04:30 PM - 05:30 PM (Evening)',
    '06:30 PM - 07:30 PM (After Maghrib)'
  ];

  // Minimum date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState(minDateStr);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [visitorName, setVisitorName] = useState('Tanvir Ahmed');
  const [visitorPhone, setVisitorPhone] = useState('01712345678');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [specialNote, setSpecialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate scheduling delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onScheduled) {
        onScheduled({
          listingId: listing.id,
          listingTitle: listing.title,
          preferredDate,
          preferredTime,
          visitorName,
          visitorPhone,
          numberOfPeople,
          specialNote
        });
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={handleResetAndClose}>
      <div
        className="visit-modal-card card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="visit-modal-title"
      >
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={handleResetAndClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="visit-success-view">
            <div className="success-icon-badge">✓</div>
            <h3 className="success-title">Visit Scheduled Successfully!</h3>
            <p className="success-subtitle">
              Your in-person flat inspection request has been sent to the property owner,{' '}
              <strong>{listing.owner?.name || 'Owner'}</strong>.
            </p>

            <div className="scheduled-summary-card">
              <div className="summary-row">
                <span>📍 Property:</span>
                <strong>{listing.title}</strong>
              </div>
              <div className="summary-row">
                <span>📅 Date:</span>
                <strong>{preferredDate}</strong>
              </div>
              <div className="summary-row">
                <span>⏰ Time Slot:</span>
                <strong>{preferredTime}</strong>
              </div>
              <div className="summary-row">
                <span>👤 Visitor:</span>
                <strong>{visitorName} ({visitorPhone})</strong>
              </div>
            </div>

            <p className="reminder-note">
              💡 <em>Tips: Wear comfortable footwear and verify line water/gas during the visit. Owner will call your phone prior to the appointment.</em>
            </p>

            <button
              type="button"
              className="btn btn-primary btn-lg full-width"
              onClick={handleResetAndClose}
            >
              Done &amp; Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header-area">
              <span className="badge badge-primary">Dhaka In-Person Inspection</span>
              <h2 id="visit-modal-title" className="modal-main-heading">
                Schedule a Free Flat Visit
              </h2>
              <p className="modal-sub-text">
                Book a physical visit for <strong>{listing.title}</strong> in {listing.area}. No broker fee.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="visit-form">
              <div className="visit-form-grid">
                <div className="form-group">
                  <label className="input-label">Preferred Date:</label>
                  <input
                    type="date"
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Preferred Time Slot:</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="modal-input modal-select"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Your Full Name:</label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    required
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Mobile Number (BD):</label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    required
                    pattern="01[3-9][0-9]{8}"
                    title="Bangladeshi mobile number format: 01XXXXXXXXX"
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Number of Visitors:</label>
                  <select
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    className="modal-input modal-select"
                  >
                    <option value="1">1 Person (Self)</option>
                    <option value="2">2 Persons (With Roommate / Friend)</option>
                    <option value="3">3+ Persons (With Family)</option>
                  </select>
                </div>

                <div className="form-group full-row">
                  <label className="input-label">Note for Landlord (Optional):</label>
                  <textarea
                    rows="2"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g. Coming by motorbike; would like to see rooftop gas & water supply."
                    className="modal-input modal-textarea"
                  />
                </div>
              </div>

              {/* Owner Quick Info Tag */}
              <div className="owner-compact-alert">
                <span>📞 Listing Owner: <strong>{listing.owner?.name}</strong></span>
                <span className="owner-phone">({listing.owner?.phone})</span>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleResetAndClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Visit Schedule'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitModal;
