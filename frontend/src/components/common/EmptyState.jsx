import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '🔍',
  title = 'No items found',
  description = 'We could not find anything matching your request.',
  actionText = null,
  onAction = null,
  secondaryActionText = null,
  onSecondaryAction = null
}) => {
  return (
    <div className="empty-state-card card" role="status">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>

      {(actionText || secondaryActionText) && (
        <div className="empty-state-actions">
          {actionText && onAction && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAction}
            >
              {actionText}
            </button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
