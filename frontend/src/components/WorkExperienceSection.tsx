import React, { useState, useEffect } from 'react';
import type { WorkExperience } from '../types';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  isLoggedIn: boolean;
  onEdit: (exp: WorkExperience) => void;
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 3;

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  experiences,
  isLoggedIn,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(experiences.length / ITEMS_PER_PAGE);
  
  // Reset to last valid page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [experiences.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExperiences = experiences.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (experiences.length === 0) return null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="section work-experience-section">
      <div className="section-header">
        <h2>Work Experience</h2>
        <span className="count-badge">{experiences.length}</span>
      </div>
      <div className="work-exp-grid">
        {paginatedExperiences.map((exp) => (
          <div key={exp.id} className="work-exp-card">
            <div className="work-exp-header">
              <h3>{exp.role}</h3>
              <span className="company-name">{exp.company}</span>
            </div>
            <p className="work-exp-dates">
              {new Date(exp.start_date).toLocaleDateString()} -{' '}
              {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
            </p>
            <p className="work-exp-description">{exp.description}</p>
            {isLoggedIn && (
              <div className="work-exp-actions">
                <button className="btn btn-sm" onClick={() => onEdit(exp)}>
                  ✏️
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(exp.id)}>
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <div className="pagination-info">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
};
