import React from 'react';
import type { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  allProjects: Project[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  searchSkill: string;
  onSearch: () => void;
  onClearSearch: () => void;
  onSearchChange: (skill: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  isLoggedIn?: boolean;
  onEditLinks?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  allProjects,
  loading,
  currentPage,
  totalPages,
  searchSkill,
  onSearch,
  onClearSearch,
  onSearchChange,
  onRefresh,
  onPageChange,
  isLoggedIn,
  onEditLinks,
}) => {
  return (
    <section className="section">
      <div className="section-header">
        <div className="header-content">
          <h2>Projects</h2>
          {allProjects.length > 0 && (
            <span className="count-badge">
              {allProjects.length} • Page {currentPage}/{totalPages}
            </span>
          )}
        </div>
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            value={searchSkill}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by skill..."
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            className="btn btn-search"
            onClick={onSearch}
            disabled={loading || !searchSkill.trim()}
            title="Search projects by skill"
          >
            🔍
          </button>
          {searchSkill && (
            <button className="btn btn-sm" onClick={onClearSearch} title="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onRefresh} disabled={loading}>
          {loading && <div className="loading"></div>}
          Refresh Projects
        </button>

        {allProjects.length > 0 && searchSkill && (
          <button className="btn btn-secondary" onClick={onClearSearch} disabled={loading}>
            Clear Search
          </button>
        )}

        {isLoggedIn && onEditLinks && (
          <button className="btn btn-secondary" onClick={onEditLinks} disabled={loading}>
            ✎ Edit Project Links
          </button>
        )}
      </div>

      {projects.length > 0 ? (
        <>
          <div className="projects-grid">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.project_url || '#'}
                target={project.project_url ? '_blank' : '_self'}
                rel={project.project_url ? 'noopener noreferrer' : ''}
                className="project-card"
                style={{ cursor: project.project_url ? 'pointer' : 'default', textDecoration: 'none', color: 'inherit' }}
              >
                <strong className="project-title">{project.title}</strong>
                <p className="project-description">{project.description}</p>
                {project.project_url && <span className="project-link-indicator">→ Open Project</span>}
              </a>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <div className="pagination-info">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : !loading ? (
        <div className="empty-state">
          No projects available. Click "Refresh Projects" or search by skill.
        </div>
      ) : null}
    </section>
  );
};
