import React from 'react';

interface ProfileLink {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

interface ProfileLinksProps {
  links: ProfileLink;
}

export const ProfileLinks: React.FC<ProfileLinksProps> = ({ links }) => {
  // Always show the section if any link exists
  const hasLinks = links.github || links.linkedin || links.portfolio;

  if (!hasLinks) {
    return null;
  }

  return (
    <section className="section profile-links-section">
      <div className="section-header">
        <h2>Connect With Me</h2>
      </div>
      <div className="links-container">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-button github"
            title="GitHub"
          >
            💻 GitHub
          </a>
        )}
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-button linkedin"
            title="LinkedIn"
          >
            💼 LinkedIn
          </a>
        )}
        {links.portfolio && (
          <a
            href={links.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="link-button portfolio"
            title="Portfolio"
          >
            🌐 Portfolio
          </a>
        )}
      </div>
    </section>
  );
};
