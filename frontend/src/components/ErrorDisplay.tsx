import React from 'react';

interface ErrorProps {
  message: string | null;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error">
      <strong>Error:</strong> {message}
      <button className="button dismiss-button" onClick={onDismiss}>
        ✕
      </button>
    </div>
  );
};
