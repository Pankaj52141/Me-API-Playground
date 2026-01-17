import React from 'react';
import type { Skill } from '../types';

interface SkillsSidebarProps {
  skills: Skill[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  skillsPerPage: number;
}

export const SkillsSidebar: React.FC<SkillsSidebarProps> = ({
  skills,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  skillsPerPage,
}) => {
  const paginatedSkills = skills.slice(
    (currentPage - 1) * skillsPerPage,
    currentPage * skillsPerPage
  );

  return (
    <section className="skills-sidebar">
      <h2>Top Skills</h2>
      {loading ? (
        <div className="loading-state">
          <div className="loading"></div>
          Loading skills...
        </div>
      ) : skills.length > 0 ? (
        <>
          <div className="skills-grid">
            {paginatedSkills.map((skill) => (
              <div key={skill.id} className="skill-badge">
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="skills-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`skill-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">No skills data available.</div>
      )}
    </section>
  );
};
