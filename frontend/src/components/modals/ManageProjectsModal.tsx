import React from 'react';
import { Modal } from '../Modal';
import type { Project, Skill } from '../../types';

interface ManageProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  allSkills: Skill[];
  projectTitle: string;
  projectDescription: string;
  editingProject: Project | null;
  selectedProject: Project | null;
  selectedProjectSkills: Skill[];
  onProjectTitleChange: (title: string) => void;
  onProjectDescriptionChange: (description: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onEdit: (project: Project) => void;
  onCancelEdit: () => void;
  onProjectSelect: (project: Project) => void;
  onAddSkill: (skillId: number) => void;
  onRemoveSkill: (skillId: number) => void;
  loading: boolean;
}

export const ManageProjectsModal: React.FC<ManageProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  allSkills,
  projectTitle,
  projectDescription,
  editingProject,
  selectedProject,
  selectedProjectSkills,
  onProjectTitleChange,
  onProjectDescriptionChange,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  onProjectSelect,
  onAddSkill,
  onRemoveSkill,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Projects" size="large">
      <div className="add-form">
        <input
          type="text"
          placeholder="Project title"
          value={projectTitle}
          onChange={(e) => onProjectTitleChange(e.target.value)}
        />
        <textarea
          placeholder="Project description"
          value={projectDescription}
          onChange={(e) => onProjectDescriptionChange(e.target.value)}
          rows={3}
        />
        <button
          className="button"
          onClick={editingProject ? onUpdate : onAdd}
          disabled={loading || !projectTitle.trim()}
        >
          {loading ? <div className="loading"></div> : editingProject ? 'Update' : 'Add'}
        </button>
        {editingProject && (
          <button className="button secondary" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
      <div className="items-list">
        {projects.map((project) => (
          <div key={project.id} className="item-row project-item">
            <div className="project-info">
              <strong>{project.title}</strong>
              <p>{project.description}</p>
            </div>
            <div className="item-actions">
              <button className="button small" onClick={() => onEdit(project)}>
                ✏️
              </button>
              <button className="button small" onClick={() => onProjectSelect(project)}>
                🏷️
              </button>
              <button className="button small danger" onClick={() => onDelete(project.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedProject && (
        <div className="project-skills-section">
          <h3>Skills for "{selectedProject.title}":</h3>
          <div className="skills-tags">
            {selectedProjectSkills.map((skill) => (
              <span key={skill.id} className="skill-tag">
                {skill.name}
                <button onClick={() => onRemoveSkill(skill.id)}>×</button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              const skillId = parseInt(e.target.value);
              if (skillId) onAddSkill(skillId);
              e.target.value = '';
            }}
          >
            <option value="">Add skill...</option>
            {allSkills
              .filter((skill) => !selectedProjectSkills.some((ps) => ps.id === skill.id))
              .map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
