import React from 'react';
import { Modal } from '../Modal';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  password: string;
  name: string;
  email: string;
  education: string;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onEducationChange: (education: string) => void;
  onSignup: () => void;
  loading: boolean;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  username,
  password,
  name,
  email,
  education,
  onUsernameChange,
  onPasswordChange,
  onNameChange,
  onEmailChange,
  onEducationChange,
  onSignup,
  loading,
  onSwitchToLogin,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Full Name"
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
        <input
          type="text"
          placeholder="Education (optional)"
          value={education}
          onChange={(e) => onEducationChange(e.target.value)}
        />
        <div className="modal-actions">
          <button className="button" onClick={onSignup} disabled={loading}>
            {loading ? <div className="loading"></div> : 'Sign Up'}
          </button>
          <button className="button secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <p>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#0066cc',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
