import React from 'react';
import { Modal } from '../Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  password: string;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onLogin: () => void;
  loading: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      <div className="modal-actions">
        <button className="button" onClick={onLogin} disabled={loading}>
          {loading ? <div className="loading"></div> : 'Login'}
        </button>
        <button className="button secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};
