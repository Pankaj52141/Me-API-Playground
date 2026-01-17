import React, { useState, useEffect } from "react";
import type { Project } from "../../types";

interface ManageProjectLinksModalProps {
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { projectId: number; url: string }[]) => Promise<void>;
}

const ManageProjectLinksModal: React.FC<ManageProjectLinksModalProps> = ({
  projects,
  isOpen,
  onClose,
  onSave,
}) => {
  const [updates, setUpdates] = useState<{ projectId: number; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with current project URLs
    setUpdates(
      projects.map((p) => ({
        projectId: p.id,
        url: p.project_url || "",
      }))
    );
  }, [projects]);

  const handleUrlChange = (projectId: number, newUrl: string) => {
    setUpdates((prev) =>
      prev.map((u) =>
        u.projectId === projectId ? { ...u, url: newUrl } : u
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(updates);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Project Links</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {projects.length === 0 ? (
            <p className="empty-state">No projects available.</p>
          ) : (
            <div className="project-links-list">
              {projects.map((project) => (
                <div key={project.id} className="project-link-item">
                  <label htmlFor={`url-${project.id}`} className="link-label">
                    {project.title}
                  </label>
                  <input
                    id={`url-${project.id}`}
                    type="url"
                    placeholder="https://github.com/..."
                    value={
                      updates.find((u) => u.projectId === project.id)?.url || ""
                    }
                    onChange={(e) =>
                      handleUrlChange(project.id, e.target.value)
                    }
                    className="link-input"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Links"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectLinksModal;
