import React, { useState } from 'react';
import './RentSplitCalculator.css';

const RentSplitCalculator = ({ defaultRent = 20000, defaultService = 2500 }) => {
  // Base property costs
  const [baseRent, setBaseRent] = useState(defaultRent);
  const [serviceCharge, setServiceCharge] = useState(defaultService);
  const [electricity, setElectricity] = useState(3000);
  const [gasBill, setGasBill] = useState(1080); // Standard Dhaka Titas double burner
  const [internetBill, setInternetBill] = useState(1200);
  const [waterWaste, setWaterWaste] = useState(800);
  const [maidCooking, setMaidCooking] = useState(4000);
  const [groceries, setGroceries] = useState(8000);

  // Roommates configuration
  const [roommates, setRoommates] = useState([
    { id: 1, name: 'Roommate 1 (Master Bed)', percentage: 55, customFixed: 0 },
    { id: 2, name: 'Roommate 2 (Second Bed)', percentage: 45, customFixed: 0 }
  ]);

  const [splitMethod, setSplitMethod] = useState('equal'); // 'equal' | 'percentage' | 'custom'

  // Calculations
  const utilitiesTotal =
    Number(serviceCharge || 0) +
    Number(electricity || 0) +
    Number(gasBill || 0) +
    Number(internetBill || 0) +
    Number(waterWaste || 0) +
    Number(maidCooking || 0) +
    Number(groceries || 0);

  const grandTotal = Number(baseRent || 0) + utilitiesTotal;
  const numMembers = roommates.length || 1;

  // Add a roommate
  const handleAddRoommate = () => {
    if (roommates.length >= 6) return;
    const newId = Date.now();
    const newCount = roommates.length + 1;
    const equalShare = Math.round(100 / newCount);

    const updated = roommates.map((r) => ({
      ...r,
      percentage: equalShare
    }));
    updated.push({
      id: newId,
      name: `Roommate ${newCount}`,
      percentage: 100 - equalShare * (newCount - 1),
      customFixed: 0
    });
    setRoommates(updated);
  };

  // Remove a roommate
  const handleRemoveRoommate = (id) => {
    if (roommates.length <= 2) return;
    const filtered = roommates.filter((r) => r.id !== id);
    const equalShare = Math.round(100 / filtered.length);
    const updated = filtered.map((r, index) => ({
      ...r,
      percentage: index === filtered.length - 1 ? 100 - equalShare * (filtered.length - 1) : equalShare
    }));
    setRoommates(updated);
  };

  // Update roommate name or value
  const handleUpdateRoommate = (id, field, value) => {
    setRoommates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Calculate per person share
  const getPersonShare = (roommate) => {
    if (splitMethod === 'equal') {
      const perRent = baseRent / numMembers;
      const perUtil = utilitiesTotal / numMembers;
      return {
        rentShare: Math.round(perRent),
        utilShare: Math.round(perUtil),
        total: Math.round(perRent + perUtil)
      };
    } else if (splitMethod === 'percentage') {
      const pct = (Number(roommate.percentage) || 0) / 100;
      const rentShare = baseRent * pct;
      const utilShare = utilitiesTotal / numMembers; // Utilities are usually split evenly in Dhaka flats
      return {
        rentShare: Math.round(rentShare),
        utilShare: Math.round(utilShare),
        total: Math.round(rentShare + utilShare)
      };
    } else {
      // Custom fixed rent assignment
      const rentShare = Number(roommate.customFixed) || 0;
      const utilShare = utilitiesTotal / numMembers;
      return {
        rentShare: Math.round(rentShare),
        utilShare: Math.round(utilShare),
        total: Math.round(rentShare + utilShare)
      };
    }
  };

  return (
    <div className="rent-split-calculator card">
      {/* Header */}
      <div className="calculator-header">
        <div className="calc-title-box">
          <span className="calc-badge">Dhaka Shared Living Utility</span>
          <h2 className="calc-title">💰 Smart Rent &amp; Utilities Split Calculator</h2>
          <p className="calc-subtitle">
            Divide apartment rent, Titas gas, DESCO/DPDC electricity, WiFi, and meal/maid costs accurately between roommates.
          </p>
        </div>
      </div>

      <div className="calculator-grid">
        {/* Left: Input Column */}
        <div className="calc-input-section">
          <h3 className="section-subtitle">1. Monthly Housing &amp; Utility Expenses</h3>

          <div className="form-group">
            <label className="calc-label">Base Apartment Rent (BDT/month):</label>
            <div className="input-prefix-box">
              <span className="prefix">৳</span>
              <input
                type="number"
                min="0"
                step="500"
                value={baseRent}
                onChange={(e) => setBaseRent(Number(e.target.value))}
                className="calc-input"
              />
            </div>
          </div>

          <div className="utilities-inputs-grid">
            <div className="form-group">
              <label className="calc-label">Service Charge / Building Lift &amp; Guard:</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="calc-label">Electricity (DESCO/DPDC Prepaid):</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="calc-label">Gas Bill (Titas Gas / Cylinder):</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={gasBill}
                  onChange={(e) => setGasBill(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="calc-label">High-Speed WiFi / Broadband:</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={internetBill}
                  onChange={(e) => setInternetBill(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="calc-label">WASA Water &amp; Waste Disposal:</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={waterWaste}
                  onChange={(e) => setWaterWaste(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="calc-label">Cook / Maid Helper Salary (Khala):</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={maidCooking}
                  onChange={(e) => setMaidCooking(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="calc-label">Shared Mess Groceries / Bazaar (Optional):</label>
              <div className="input-prefix-box">
                <span className="prefix">৳</span>
                <input
                  type="number"
                  min="0"
                  value={groceries}
                  onChange={(e) => setGroceries(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>
          </div>

          <div className="calc-subtotal-bar">
            <span>Combined Monthly Flat Expense:</span>
            <strong>৳ {grandTotal.toLocaleString()}</strong>
          </div>

          {/* Step 2: Split Strategy */}
          <div className="split-strategy-box">
            <h3 className="section-subtitle">2. Choose Room Division Method</h3>
            <div className="split-method-pills">
              <button
                type="button"
                className={`method-pill ${splitMethod === 'equal' ? 'active' : ''}`}
                onClick={() => setSplitMethod('equal')}
              >
                ⚖️ Equal Split (50/50)
              </button>
              <button
                type="button"
                className={`method-pill ${splitMethod === 'percentage' ? 'active' : ''}`}
                onClick={() => setSplitMethod('percentage')}
              >
                📐 By Room Size / Ratio
              </button>
              <button
                type="button"
                className={`method-pill ${splitMethod === 'custom' ? 'active' : ''}`}
                onClick={() => setSplitMethod('custom')}
              >
                🏷️ Custom Room Rates
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results & Roommates Summary */}
        <div className="calc-breakdown-section">
          <div className="breakdown-header-row">
            <h3 className="section-subtitle">Roommates ({numMembers})</h3>
            <button
              type="button"
              className="btn btn-outline btn-sm add-roommate-btn"
              onClick={handleAddRoommate}
              disabled={roommates.length >= 6}
            >
              + Add Roommate
            </button>
          </div>

          <div className="roommates-cards-stack">
            {roommates.map((r, index) => {
              const share = getPersonShare(r);
              return (
                <div key={r.id} className="roommate-share-card">
                  <div className="roommate-card-top">
                    <input
                      type="text"
                      className="roommate-name-input"
                      value={r.name}
                      onChange={(e) => handleUpdateRoommate(r.id, 'name', e.target.value)}
                    />
                    {roommates.length > 2 && (
                      <button
                        type="button"
                        className="remove-roommate-btn"
                        onClick={() => handleRemoveRoommate(r.id)}
                        title="Remove person"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Percentage Adjuster */}
                  {splitMethod === 'percentage' && (
                    <div className="percentage-slider-row">
                      <div className="slider-label">
                        <span>Room Rent Ratio:</span>
                        <strong>{r.percentage}%</strong>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={r.percentage}
                        onChange={(e) => handleUpdateRoommate(r.id, 'percentage', Number(e.target.value))}
                        className="ratio-slider"
                      />
                    </div>
                  )}

                  {/* Custom Fixed Amount */}
                  {splitMethod === 'custom' && (
                    <div className="custom-fixed-row">
                      <label className="slider-label">Assigned Rent Share (৳):</label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={r.customFixed}
                        onChange={(e) => handleUpdateRoommate(r.id, 'customFixed', Number(e.target.value))}
                        className="calc-input input-sm"
                        placeholder="e.g. 11000"
                      />
                    </div>
                  )}

                  {/* Breakdown details */}
                  <div className="person-expense-breakdown">
                    <div className="breakdown-row">
                      <span>Room Rent:</span>
                      <span>৳ {share.rentShare.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Utilities &amp; Mess:</span>
                      <span>৳ {share.utilShare.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-total-row">
                      <span>Total to Pay:</span>
                      <strong className="person-total">৳ {share.total.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Summary Box */}
          <div className="grand-summary-banner">
            <div className="banner-item">
              <span className="banner-label">House Rent</span>
              <span className="banner-val">৳ {baseRent.toLocaleString()}</span>
            </div>
            <div className="banner-plus">+</div>
            <div className="banner-item">
              <span className="banner-label">Utilities &amp; Mess</span>
              <span className="banner-val">৳ {utilitiesTotal.toLocaleString()}</span>
            </div>
            <div className="banner-equals">=</div>
            <div className="banner-item highlight">
              <span className="banner-label">Total Monthly Flat Pool</span>
              <span className="banner-val">৳ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentSplitCalculator;
