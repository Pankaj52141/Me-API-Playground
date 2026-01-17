import React from 'react';

interface FooterProps {
  apiUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ apiUrl }) => {
  return (
    <footer className="footer">
      <div className="api-status">
        <span className="status-dot"></span>
        API Status: Connected to {apiUrl}
      </div>
      <div className="footer-text">Built with React & Express</div>
    </footer>
  );
};
