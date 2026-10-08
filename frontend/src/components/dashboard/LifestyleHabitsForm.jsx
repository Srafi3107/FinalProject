import React, { useState } from 'react';
import Button from '../common/Button';

const LifestyleHabitsForm = ({ initialHabits, onSave }) => {
  const [habits, setHabits] = useState(initialHabits || {
    smoking: 'non_smoker',
    cleanliness: 5,
    sleepTime: 'normal',
    cookingFrequency: 'daily',
    guestsPolicy: 'weekends_only',
    genderPreference: 'male'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelect = (key, value) => {
    setHabits((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(habits);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Lifestyle Habits &amp; Compatibility</h2>
          <p className="card-desc">
            These 5 habits drive our Weighted Cosine Similarity &amp; KNN algorithm to match you with compatible Dhaka roommates.
          </p>
        </div>
        <span className="badge badge-secondary">AI Weights: 30%, 25%, 20%, 15%, 10%</span>
      </div>

      {savedSuccess && (
        <div className="alert-success" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          ✓ Lifestyle habits updated! Compatible roommate recommendations recalculated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-form">
        {/* 1. Smoking Habit (30% weight) */}
        <div className="form-group">
          <div className="label-with-weight">
            <label className="form-label">1. Smoking Habit</label>
            <span className="weight-tag">Weight: 30%</span>
          </div>
          <div className="choice-cards-row">
            {[
              { val: 'non_smoker', icon: '🚭', label: 'Strict Non-Smoker', sub: 'Prefer smoke-free flat' },
              { val: 'occasional', icon: '🚬', label: 'Occasional / Balcony', sub: 'Smokes on balcony only' },
              { val: 'smoker', icon: '💨', label: 'Smoker Friendly', sub: 'Comfortable with smokers' }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                className={`choice-card ${habits.smoking === opt.val ? 'selected' : ''}`}
                onClick={() => handleSelect('smoking', opt.val)}
              >
                <span className="choice-icon">{opt.icon}</span>
                <span className="choice-label">{opt.label}</span>
                <span className="choice-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Cleanliness Level (25% weight) */}
        <div className="form-group">
          <div className="label-with-weight">
            <label className="form-label">2. Cleanliness &amp; Organization Level</label>
            <span className="weight-tag">Weight: 25%</span>
          </div>
          <div className="cleanliness-scale">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`scale-btn ${habits.cleanliness === lvl ? 'selected' : ''}`}
                onClick={() => handleSelect('cleanliness', lvl)}
              >
                <span className="scale-num">{lvl}</span>
                <span className="scale-stars">{'★'.repeat(lvl)}</span>
                <span className="scale-text">
                  {lvl === 1 && 'Casual / Relaxed'}
                  {lvl === 2 && 'Fair'}
                  {lvl === 3 && 'Moderate'}
                  {lvl === 4 && 'Tidy & Neat'}
                  {lvl === 5 && 'Spotless Daily'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Sleep Routine (20% weight) */}
        <div className="form-group">
          <div className="label-with-weight">
            <label className="form-label">3. Sleep Hours &amp; Quiet Time</label>
            <span className="weight-tag">Weight: 20%</span>
          </div>
          <div className="choice-cards-row">
            {[
              { val: 'early', icon: '🌅', label: 'Early Bird', sub: 'Sleeps before 11:00 PM' },
              { val: 'normal', icon: '🌙', label: 'Normal Hours', sub: 'Sleeps 11:00 PM - 1:00 AM' },
              { val: 'night_owl', icon: '🦉', label: 'Night Owl', sub: 'Stays awake past 1:00 AM' }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                className={`choice-card ${habits.sleepTime === opt.val ? 'selected' : ''}`}
                onClick={() => handleSelect('sleepTime', opt.val)}
              >
                <span className="choice-icon">{opt.icon}</span>
                <span className="choice-label">{opt.label}</span>
                <span className="choice-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Cooking Frequency (10% weight) & Guests Policy */}
        <div className="form-row-2">
          <div className="form-group">
            <div className="label-with-weight">
              <label className="form-label">4. Cooking Frequency</label>
              <span className="weight-tag">Weight: 10%</span>
            </div>
            <select
              value={habits.cookingFrequency}
              onChange={(e) => handleSelect('cookingFrequency', e.target.value)}
              className="form-select"
            >
              <option value="none">Eat Out / Mess Meal (No cooking)</option>
              <option value="occasional">Occasional (Weekends / Simple meals)</option>
              <option value="daily">Daily Home Cooking in Flat</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">5. Outside Guests Policy</label>
            <select
              value={habits.guestsPolicy}
              onChange={(e) => handleSelect('guestsPolicy', e.target.value)}
              className="form-select"
            >
              <option value="no_guests">No Outside Guests Allowed</option>
              <option value="weekends_only">Weekend Friends / Study Group Allowed</option>
              <option value="flexible">Flexible / Any Time with Notice</option>
            </select>
          </div>
        </div>

        {/* 6. Gender Preference for Roommate */}
        <div className="form-group">
          <label className="form-label">Preferred Roommate Gender</label>
          <div className="pill-selector">
            {[
              { val: 'male', label: 'Male Roommate Only' },
              { val: 'female', label: 'Female Roommate Only' },
              { val: 'any', label: 'No Preference / Mixed' }
            ].map((g) => (
              <button
                key={g.val}
                type="button"
                className={`filter-pill-btn ${habits.genderPreference === g.val ? 'active' : ''}`}
                onClick={() => handleSelect('genderPreference', g.val)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-submit-row">
          <Button type="submit" variant="primary" size="md">
            Save Lifestyle Habits
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LifestyleHabitsForm;
