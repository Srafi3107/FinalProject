import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import './VisitModal.css';

const VisitModal = ({ isOpen, onClose, listing, initialType = 'visit', onScheduled }) => {
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

  const [requestType, setRequestType] = useState(initialType || 'visit');
  const [preferredDate, setPreferredDate] = useState(minDateStr);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [offerRent, setOfferRent] = useState(listing?.rent || 15000);
  const [visitorName, setVisitorName] = useState('Tanvir Ahmed');
  const [visitorPhone, setVisitorPhone] = useState('01712345678');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [specialNote, setSpecialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialType) {
      setRequestType(initialType);
    }
    if (listing?.rent) {
      setOfferRent(listing.rent);
    }
  }, [initialType, listing]);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        listingId: listing.id,
        listingTitle: listing.title,
        listingArea: listing.area,
        listingRent: listing.rent,
        type: requestType,
        targetDate: preferredDate,
        preferredSlot: requestType === 'visit' ? preferredTime : null,
        numberOfVisitors: Number(numberOfPeople),
        offerRent: requestType === 'rent' ? Number(offerRent) : null,
        message: specialNote,
        visitorName,
        visitorPhone
      };

      const res = await requestService.createRequest(payload);

      if (res?.success) {
        setIsSuccess(true);
        if (onScheduled) {
          onScheduled({
            ...payload,
            requestId: res.request?.id,
            fromApi: res.fromApi
          });
        }
      } else {
        setErrorMessage('Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Request submission failed:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
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
            <h3 className="success-title">
              {requestType === 'visit' ? 'Visit Scheduled Successfully!' : 'Rent Application Submitted!'}
            </h3>
            <p className="success-subtitle">
              Your inquiry has been sent directly to the property owner,{' '}
              <strong>{listing.owner?.name || 'Owner'}</strong>.
            </p>

            <div className="scheduled-summary-card">
              <div className="summary-row">
                <span>📍 Property:</span>
                <strong>{listing.title}</strong>
              </div>
              <div className="summary-row">
                <span>📅 {requestType === 'visit' ? 'Visit Date' : 'Target Move-in'}:</span>
                <strong>{preferredDate}</strong>
              </div>
              {requestType === 'visit' ? (
                <div className="summary-row">
                  <span>⏰ Time Slot:</span>
                  <strong>{preferredTime}</strong>
                </div>
              ) : (
                <div className="summary-row">
                  <span>💰 Offered Monthly Rent:</span>
                  <strong>৳ {Number(offerRent).toLocaleString()} / mo</strong>
                </div>
              )}
              <div className="summary-row">
                <span>👤 Applicant:</span>
                <strong>{visitorName} ({visitorPhone})</strong>
              </div>
            </div>

            <p className="reminder-note">
              💡 <em>Tips: Landlord will review your inquiry and contact your mobile number. You can track this under Dashboard &rarr; Inquiries.</em>
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
              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${requestType === 'visit' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setRequestType('visit')}
                >
                  📅 Schedule Free Visit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${requestType === 'rent' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setRequestType('rent')}
                >
                  🏠 Send Rent Request
                </button>
              </div>

              <h2 id="visit-modal-title" className="modal-main-heading">
                {requestType === 'visit' ? 'Schedule a Free Flat Visit' : 'Apply for Rent / Sublet'}
              </h2>
              <p className="modal-sub-text">
                {requestType === 'visit'
                  ? `Book an in-person physical inspection for ${listing.title} in ${listing.area}. Zero broker fee.`
                  : `Send your rent application and proposed monthly rent to ${listing.owner?.name || 'the owner'}.`}
              </p>
            </div>

            {errorMessage && (
              <div className="alert-danger" style={{ padding: '0.6rem 0.9rem', borderRadius: '6px', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.875rem' }}>
                ✕ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="visit-form">
              <div className="visit-form-grid">
                <div className="form-group">
                  <label className="input-label">
                    {requestType === 'visit' ? 'Preferred Visit Date:' : 'Target Move-in Date:'}
                  </label>
                  <input
                    type="date"
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="modal-input"
                  />
                </div>

                {requestType === 'visit' ? (
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
                ) : (
                  <div className="form-group">
                    <label className="input-label">Offered Monthly Rent (BDT):</label>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={offerRent}
                      onChange={(e) => setOfferRent(e.target.value)}
                      required
                      className="modal-input"
                    />
                  </div>
                )}

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
                  <label className="input-label">
                    {requestType === 'visit' ? 'Number of Visitors:' : 'Number of Occupants:'}
                  </label>
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
                  <label className="input-label">
                    {requestType === 'visit' ? 'Note for Landlord (Optional):' : 'Application Message / Intro:'}
                  </label>
                  <textarea
                    rows="2"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder={
                      requestType === 'visit'
                        ? 'e.g. Coming by motorbike; would like to see rooftop gas & water supply.'
                        : 'e.g. We are 2 bachelor students at NSU with quiet habits looking for long-term stay.'
                    }
                    className="modal-input modal-textarea"
                  />
                </div>
              </div>

              {/* Owner Quick Info Tag */}
              <div className="owner-compact-alert">
                <span>📞 Listing Owner: <strong>{listing.owner?.name || 'Landlord'}</strong></span>
                {listing.owner?.phone && (
                  <span className="owner-phone">({listing.owner?.phone})</span>
                )}
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
                  {isSubmitting
                    ? 'Submitting...'
                    : requestType === 'visit'
                    ? 'Confirm Visit Schedule'
                    : 'Submit Rent Application'}
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
