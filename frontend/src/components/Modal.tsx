import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'normal' | 'large';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'normal',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${size === 'large' ? 'large-modal' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};
