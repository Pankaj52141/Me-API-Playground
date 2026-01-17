import React from 'react';
import { Modal } from '../Modal';
import type { Skill } from '../../types';

interface ManageSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  skillName: string;
  editingSkill: Skill | null;
  onSkillNameChange: (name: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onEdit: (skill: Skill) => void;
  onCancelEdit: () => void;
  loading: boolean;
}

export const ManageSkillsModal: React.FC<ManageSkillsModalProps> = ({
  isOpen,
  onClose,
  skills,
  skillName,
  editingSkill,
  onSkillNameChange,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Skills" size="large">
      <div className="add-form">
        <input
          type="text"
          placeholder="New skill name"
          value={skillName}
          onChange={(e) => onSkillNameChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (editingSkill ? onUpdate() : onAdd())}
        />
        <button
          className="button"
          onClick={editingSkill ? onUpdate : onAdd}
          disabled={loading || !skillName.trim()}
        >
          {loading ? <div className="loading"></div> : editingSkill ? 'Update' : 'Add'}
        </button>
        {editingSkill && (
          <button className="button secondary" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
      <div className="items-list">
        {skills.map((skill) => (
          <div key={skill.id} className="item-row">
            <span>{skill.name}</span>
            <div className="item-actions">
              <button className="button small" onClick={() => onEdit(skill)}>
                ✏️
              </button>
              <button className="button small danger" onClick={() => onDelete(skill.id)}>
                🗑️
              </button>
            </div>
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
