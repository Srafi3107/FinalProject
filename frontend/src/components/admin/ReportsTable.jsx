import React, { useState } from 'react';

const ReportsTable = ({ reports, onUpdateReportStatus }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">User &amp; Listing Reports</h2>
          <p className="card-desc">
            Review community incident reports regarding fraudulent listings, illegal sublets, or fake owners.
          </p>
        </div>
        <div className="table-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Reports ({reports.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            ⏳ Pending ({reports.filter((r) => r.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            ✓ Resolved ({reports.filter((r) => r.status === 'resolved').length})
          </button>
        </div>
      </div>

      <div className="reports-stack">
        {filteredReports.map((report) => (
          <div key={report.id} className={`report-item-card status-${report.status}`}>
            <div className="report-header-line">
              <div className="report-type-box">
                <span className={`badge ${report.reportedType === 'listing' ? 'badge-primary' : 'badge-secondary'}`}>
                  Report #{report.id} &bull; {report.reportedType.toUpperCase()}
                </span>
                <span className="report-time">Reported on {report.createdAt}</span>
              </div>
              <span className={`status-badge ${report.status}`}>
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="report-body-box">
              <div className="report-target-row">
                <span className="target-lbl">Target:</span>
                <strong>{report.targetTitle}</strong>
              </div>

              <div className="report-reason-row">
                <span className="reason-lbl">Reason:</span>
                <span className="reason-val-tag">{report.reason}</span>
              </div>

              <p className="report-details-quote">
                "{report.details}"
              </p>

              <div className="reporter-meta-line">
                <span>Filed by: <strong>{report.reporterName}</strong> ({report.reporterEmail})</span>
              </div>
            </div>

            <div className="report-actions-row">
              {report.status === 'pending' ? (
                <div className="pending-actions-group">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onUpdateReportStatus(report.id, 'resolved')}
                  >
                    ✓ Take Action &amp; Resolve
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => onUpdateReportStatus(report.id, 'dismissed')}
                  >
                    Dismiss Report
                  </button>
                </div>
              ) : (
                <span className="resolved-note-text">
                  This report was marked as <strong>{report.status}</strong>.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsTable;
