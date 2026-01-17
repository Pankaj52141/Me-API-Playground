import React from 'react';
import type { Profile } from '../types';

interface ProfileLink {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

interface ProfileSectionProps {
  profile: Profile | null;
  loading: boolean;
  isLoggedIn: boolean;
  profileLinks?: ProfileLink;
  onEdit: () => void;
  onSkillsClick: () => void;
  onProjectsClick: () => void;
  onExperienceClick: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onRefresh: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  loading,
  isLoggedIn,
  profileLinks = {},
  onEdit,
  onSkillsClick,
  onProjectsClick,
  onExperienceClick,
  onLogout,
  onLogin,
  onRefresh,
}) => {
  return (
    <section className="profile-section">
      <div className="profile-header">
        <div className="profile-title">
          <h1>My Profile</h1>
          {!isLoggedIn && <span className="profile-subtitle">(login to edit details)</span>}
        </div>
        <div className="profile-actions">
          {isLoggedIn ? (
            <>
              <button className="btn btn-icon" onClick={onEdit} title="Edit profile">
                ✏️ Edit
              </button>
              <button className="btn btn-icon" onClick={onSkillsClick} title="Manage skills">
                🛠️ Skills
              </button>
              <button className="btn btn-icon" onClick={onProjectsClick} title="Manage projects">
                📁 Projects
              </button>
              <button className="btn btn-icon" onClick={onExperienceClick} title="Manage work experience">
                💼 Experience
              </button>
              <button className="btn btn-logout" onClick={onLogout} title="Logout">
                🚪 Logout
              </button>
            </>
          ) : (
            <button className="btn btn-login" onClick={onLogin} title="Login">
              🔐 Login
            </button>
          )}
          <button
            className="btn btn-refresh"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh profile data"
          >
            {loading ? <div className="loading"></div> : '🔄'}
          </button>
        </div>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="loading"></div>
          Loading profile...
        </div>
      ) : profile ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          {(profileLinks.github || profileLinks.linkedin || profileLinks.portfolio) && (
            <div className="profile-links">
              {profileLinks.github && (
                <a href={profileLinks.github} target="_blank" rel="noopener noreferrer" className="profile-link" title="GitHub">
                  💻 GitHub
                </a>
              )}
              {profileLinks.linkedin && (
                <a href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link" title="LinkedIn">
                  💼 LinkedIn
                </a>
              )}
              {profileLinks.portfolio && (
                <a href={profileLinks.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link" title="Portfolio">
                  🌐 Portfolio
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          No profile data available. Please check your backend connection.
        </div>
      )}
    </section>
  );
};
