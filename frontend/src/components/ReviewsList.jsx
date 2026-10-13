import React, { useState } from 'react';
import StarRating from './StarRating';
import { useToast } from '../context/ToastContext';
import './ReviewsList.css';

const ReviewsList = ({ listingId, initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPros, setNewPros] = useState('');
  const [newCons, setNewCons] = useState('');
  const [reviewerName, setReviewerName] = useState('Tanvir Ahmed');
  const [reviewerRole, setReviewerRole] = useState('Student Tenant');

  const { showSuccess, showWarning } = useToast();

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showWarning('Please enter your review feedback');
      return;
    }

    const reviewObj = {
      id: Date.now(),
      listingId,
      userName: reviewerName,
      userRole: reviewerRole,
      userAvatar: '👤',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      pros: newPros.trim(),
      cons: newCons.trim()
    };

    setReviews([reviewObj, ...reviews]);
    setShowAddForm(false);
    setNewComment('');
    setNewPros('');
    setNewCons('');
    showSuccess('Review submitted! Thank you for helping Dhaka tenants.');
  };

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="reviews-section card">
      {/* Section Header */}
      <div className="reviews-header-row">
        <div>
          <h2 className="section-heading">Tenant Ratings &amp; Reviews</h2>
          <div className="reviews-meta-tag">
            <StarRating rating={Number(avgRating)} size="md" />
            <span className="avg-num">{avgRating} out of 5</span>
            <span className="total-reviews">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm write-review-toggle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '✍️ Write a Review'}
        </button>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleAddReview} className="add-review-form">
          <h3 className="form-subheading">Share Your Experience with this Flat &amp; Owner</h3>

          <div className="form-rating-selector">
            <label className="input-label">Your Rating:</label>
            <StarRating
              rating={newRating}
              interactive={true}
              size="lg"
              onChange={(val) => setNewRating(val)}
              showValue={true}
            />
          </div>

          <div className="review-inputs-grid">
            <div className="form-group">
              <label className="input-label">Your Name:</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
                className="review-input"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Tenant Role / Occupation:</label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                placeholder="e.g. Student at AIUB / Job Holder"
                required
                className="review-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="input-label">Detailed Review / Feedback:</label>
              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe water availability, gas pressure, landlord cooperation, lift, and neighborhood safety..."
                required
                className="review-input review-textarea"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Pros (Good points):</label>
              <input
                type="text"
                value={newPros}
                onChange={(e) => setNewPros(e.target.value)}
                placeholder="e.g. High water pressure, 2 min to bus stand"
                className="review-input"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Cons (Issues or cautions):</label>
              <input
                type="text"
                value={newCons}
                onChange={(e) => setNewCons(e.target.value)}
                placeholder="e.g. Strict gate timing at night"
                className="review-input"
              />
            </div>
          </div>

          <div className="form-actions-right">
            <button type="submit" className="btn btn-primary">
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List Feed */}
      <div className="reviews-feed">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className="review-card-item">
              <div className="review-top-row">
                <div className="reviewer-info">
                  <span className="reviewer-avatar">{r.userAvatar || '👤'}</span>
                  <div>
                    <h4 className="reviewer-name">{r.userName}</h4>
                    <span className="reviewer-role">{r.userRole} &bull; {r.date}</span>
                  </div>
                </div>
                <StarRating rating={r.rating} size="sm" />
              </div>

              <p className="review-comment-text">{r.comment}</p>

              {(r.pros || r.cons) && (
                <div className="review-pros-cons">
                  {r.pros && (
                    <div className="pro-pill">
                      <span className="pro-icon">👍 Pros:</span> {r.pros}
                    </div>
                  )}
                  {r.cons && (
                    <div className="con-pill">
                      <span className="con-icon">⚠️ Cons:</span> {r.cons}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-reviews-box">
            <span className="no-reviews-icon">💬</span>
            <p>No tenant reviews yet for this listing. Be the first to leave feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
