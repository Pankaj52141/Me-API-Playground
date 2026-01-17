import React from 'react';
import { Modal } from '../Modal';
import type { WorkExperience } from '../../types';

interface ManageWorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiences: WorkExperience[];
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  editingExp: WorkExperience | null;
  isLoggedIn: boolean;
  onCompanyChange: (company: string) => void;
  onRoleChange: (role: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDescriptionChange: (description: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onEdit: (exp: WorkExperience) => void;
  onCancelEdit: () => void;
  loading: boolean;
}

export const ManageWorkExperienceModal: React.FC<ManageWorkExperienceModalProps> = ({
  isOpen,
  onClose,
  experiences,
  company,
  role,
  startDate,
  endDate,
  description,
  editingExp,
  isLoggedIn,
  onCompanyChange,
  onRoleChange,
  onStartDateChange,
  onEndDateChange,
  onDescriptionChange,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Work Experience" size="large">
      {isLoggedIn ? (
        <>
          <div className="add-form">
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
            />
            <button
              className="button"
              onClick={editingExp ? onUpdate : onAdd}
              disabled={loading || !company.trim() || !role.trim()}
            >
              {loading ? <div className="loading"></div> : editingExp ? 'Update' : 'Add'}
            </button>
            {editingExp && (
              <button className="button secondary" onClick={onCancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">Please login to manage work experience</div>
      )}
      <div className="items-list">
        {experiences.map((exp) => (
          <div key={exp.id} className="item-row">
            <div>
              <strong>{exp.role}</strong> at {exp.company}
              <p>
                {new Date(exp.start_date).toLocaleDateString()} -{' '}
                {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
              </p>
              <p>{exp.description}</p>
            </div>
            {isLoggedIn && (
              <div className="item-actions">
                <button className="button small" onClick={() => onEdit(exp)}>
                  ✏️
                </button>
                <button className="button small danger" onClick={() => onDelete(exp.id)}>
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
