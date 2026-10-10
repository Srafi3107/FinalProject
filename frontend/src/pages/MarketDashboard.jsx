import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { mockMarketData, DHAKA_AREAS } from '../data/mockData';
import './MarketDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketDashboard = () => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');
  const [selectedBedroomFilter, setSelectedBedroomFilter] = useState('all');

  const { summary } = mockMarketData;

  // Chart 1: Average Rent by Area (Bar Chart)
  const areaChartData = useMemo(() => {
    let labels = [...mockMarketData.avgRentByArea.labels];
    let data = [...mockMarketData.avgRentByArea.data];

    if (selectedAreaFilter !== 'all') {
      const idx = labels.indexOf(selectedAreaFilter);
      if (idx !== -1) {
        labels = [labels[idx]];
        data = [data[idx]];
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Average Rent (BDT/month)',
          data,
          backgroundColor: 'rgba(13, 148, 136, 0.85)',
          borderColor: '#0d9488',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    };
  }, [selectedAreaFilter]);

  // Chart 2: Average Rent by Bedrooms (Bar Chart)
  const bedroomChartData = useMemo(() => {
    return {
      labels: mockMarketData.avgRentByBedrooms.labels,
      datasets: [
        {
          label: 'Average Rent by Layout (BDT/month)',
          data: mockMarketData.avgRentByBedrooms.data,
          backgroundColor: 'rgba(249, 115, 22, 0.85)',
          borderColor: '#f97316',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    };
  }, []);

  // Chart 3: Same Area Comparison Across 3 Portals (Grouped Bar Chart)
  const groupedComparisonData = useMemo(() => {
    return {
      labels: mockMarketData.websiteComparison.areas,
      datasets: [
        {
          label: 'Bikroy.com',
          data: mockMarketData.websiteComparison.bikroy,
          backgroundColor: '#3b82f6',
          borderRadius: 4
        },
        {
          label: 'bdHousing.com',
          data: mockMarketData.websiteComparison.bdHousing,
          backgroundColor: '#10b981',
          borderRadius: 4
        },
        {
          label: 'Rents.com.bd',
          data: mockMarketData.websiteComparison.rentsBd,
          backgroundColor: '#8b5cf6',
          borderRadius: 4
        }
      ]
    };
  }, []);

  // Chart 4: Listings per Website (Doughnut Chart)
  const doughnutWebsiteData = useMemo(() => {
    return {
      labels: mockMarketData.listingsPerWebsite.labels,
      datasets: [
        {
          data: mockMarketData.listingsPerWebsite.data,
          backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }, []);

  // Chart 5: Furnished vs Unfurnished (Doughnut Chart)
  const doughnutFurnishedData = useMemo(() => {
    return {
      labels: mockMarketData.furnishedVsUnfurnished.labels,
      datasets: [
        {
          data: mockMarketData.furnishedVsUnfurnished.data,
          backgroundColor: ['#0d9488', '#f59e0b', '#64748b'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }, []);

  // Chart 6: Rent Trend Over Time (Line Chart)
  const rentTrendData = useMemo(() => {
    return {
      labels: mockMarketData.rentTrendOverTime.labels,
      datasets: [
        {
          label: 'Dhaka Average Rent Index (BDT)',
          data: mockMarketData.rentTrendOverTime.data,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.12)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#0d9488',
          pointRadius: 5
        }
      ]
    };
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
        }
      }
    }
  };

  return (
    <div className="market-dashboard-page">
      {/* Header Banner */}
      <section className="market-banner">
        <div className="container">
          <div className="market-header-meta">
            <span className="badge badge-info">🎓 Supervisor Requirement &bull; Scraper Engine</span>
            <h1 className="market-title">Dhaka Rent Market Intelligence Dashboard</h1>
            <p className="market-subtitle">
              Live visualization of housing rental trends collected from top Bangladesh property portals: <strong>Bikroy.com</strong>, <strong>bdHousing.com</strong>, and <strong>Rents.com.bd</strong>.
            </p>
          </div>

          {/* Task 6: Summary Cards */}
          <div className="market-summary-grid">
            <div className="market-summary-card">
              <span className="summary-icon">📊</span>
              <div className="summary-content">
                <span className="summary-val">{summary.totalScrapedListings.toLocaleString()}</span>
                <span className="summary-lbl">Total Scraped Listings</span>
              </div>
            </div>

            <div className="market-summary-card">
              <span className="summary-icon">💰</span>
              <div className="summary-content">
                <span className="summary-val">৳ {summary.averageDhakaRent.toLocaleString()}</span>
                <span className="summary-lbl">Dhaka Avg Rent / month</span>
              </div>
            </div>

            <div className="market-summary-card">
              <span className="summary-icon">🏷️</span>
              <div className="summary-content">
                <span className="summary-val text-success">{summary.cheapestArea}</span>
                <span className="summary-lbl">Cheapest Rent Area</span>
              </div>
            </div>

            <div className="market-summary-card">
              <span className="summary-icon">🏙️</span>
              <div className="summary-content">
                <span className="summary-val text-primary">{summary.mostExpensiveArea}</span>
                <span className="summary-lbl">Most Expensive Area</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Visuals Container */}
      <div className="container market-content-container">
        {/* Controls & Filter Bar */}
        <div className="market-filters-card card">
          <div className="filter-select-group">
            <label className="filter-caption">Rental Portal Source:</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="market-select"
            >
              <option value="all">All 3 Portals (Combined)</option>
              <option value="bikroy">Bikroy.com</option>
              <option value="bdhousing">bdHousing.com</option>
              <option value="rents">Rents.com.bd</option>
            </select>
          </div>

          <div className="filter-select-group">
            <label className="filter-caption">Focus Dhaka Area:</label>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="market-select"
            >
              <option value="all">All 10 Dhaka Neighborhoods</option>
              {DHAKA_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label className="filter-caption">Bedroom Filter:</label>
            <select
              value={selectedBedroomFilter}
              onChange={(e) => setSelectedBedroomFilter(e.target.value)}
              className="market-select"
            >
              <option value="all">All Layouts (1 to 4+ Beds)</option>
              <option value="1">1 Bed / Bachelor Sublet</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div className="scraped-date-tag">
            <span>📅 Last Updated: <strong>{summary.lastUpdated}</strong></span>
          </div>
        </div>

        {/* Task 7: Charts Grid */}
        <div className="charts-grid-stack">
          {/* Chart 1: Average Rent by Area */}
          <div className="card chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Average Monthly Rent by Dhaka Neighborhood (BDT)</h3>
              <span className="badge badge-primary">Bar Chart</span>
            </div>
            <div className="chart-canvas-container">
              <Bar data={areaChartData} options={chartOptions} />
            </div>
          </div>

          {/* Chart 2: Average Rent by Bedrooms */}
          <div className="card chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Average Rent by Bedroom Layout (BDT)</h3>
              <span className="badge badge-secondary">Bar Chart</span>
            </div>
            <div className="chart-canvas-container">
              <Bar data={bedroomChartData} options={chartOptions} />
            </div>
          </div>

          {/* Chart 3: Same Area Comparison Across 3 Websites */}
          <div className="card chart-card full-span">
            <div className="chart-header">
              <h3 className="chart-title">Rent Comparison for Same Area Across 3 Websites</h3>
              <span className="badge badge-info">Grouped Bar Chart &bull; Bikroy vs bdHousing vs Rents</span>
            </div>
            <div className="chart-canvas-container" style={{ height: '340px' }}>
              <Bar data={groupedComparisonData} options={chartOptions} />
            </div>
          </div>

          {/* 2-Column Row for Doughnut Charts */}
          <div className="grid-2 full-span">
            {/* Chart 4: Listings per Website */}
            <div className="card chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Listings Collected per Website</h3>
                <span className="badge badge-primary">Doughnut Chart</span>
              </div>
              <div className="chart-canvas-container" style={{ height: '260px' }}>
                <Doughnut data={doughnutWebsiteData} options={doughnutOptions} />
              </div>
            </div>

            {/* Chart 5: Furnished vs Unfurnished */}
            <div className="card chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Furnishing Status Distribution</h3>
                <span className="badge badge-secondary">Doughnut Chart</span>
              </div>
              <div className="chart-canvas-container" style={{ height: '260px' }}>
                <Doughnut data={doughnutFurnishedData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Chart 6: Rent Trend Over Time */}
          <div className="card chart-card full-span">
            <div className="chart-header">
              <h3 className="chart-title">Dhaka Average Rent Trend Over Time (May - Oct 2026)</h3>
              <span className="badge badge-success">Smooth Line Chart</span>
            </div>
            <div className="chart-canvas-container" style={{ height: '320px' }}>
              <Line data={rentTrendData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
