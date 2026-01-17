import React from 'react';
import { Modal } from '../Modal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  education: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onEducationChange: (education: string) => void;
  onUpdate: () => void;
  loading: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  name,
  email,
  education,
  onNameChange,
  onEmailChange,
  onEducationChange,
  onUpdate,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="Education"
        value={education}
        onChange={(e) => onEducationChange(e.target.value)}
      />
      <div className="modal-actions">
        <button className="button" onClick={onUpdate} disabled={loading}>
          {loading ? <div className="loading"></div> : 'Update'}
        </button>
        <button className="button secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};
