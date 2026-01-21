import { useEffect, useState } from 'react';
import './App.css';
import { useApi } from './hooks/useApi';
import { useAuth } from './hooks/useAuth';
import type { Profile, Project, Skill, WorkExperience } from './types';
import { ProfileSection } from './components/ProfileSection';
import { SkillsSidebar } from './components/SkillsSidebar';
import { ProjectsSection } from './components/ProjectsSection';
import { WorkExperienceSection } from './components/WorkExperienceSection';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Footer } from './components/Footer';
import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { ManageSkillsModal } from './components/modals/ManageSkillsModal';
import { ManageProjectsModal } from './components/modals/ManageProjectsModal';
import { ManageWorkExperienceModal } from './components/modals/ManageWorkExperienceModal';
import ManageProjectLinksModal from './components/modals/ManageProjectLinksModal';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  // API hooks
  const profileApi = useApi<Profile>();
  const projectsApi = useApi<Project[]>();
  const skillsApi = useApi<Skill[]>();
  const workExpApi = useApi<WorkExperience[]>();

  // Auth hook
  const { token, isLoggedIn, login, signup, logout, loading: authLoading } = useAuth();

  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [profileLinks, setProfileLinks] = useState({ 
    github: 'https://github.com/Pankaj52141', 
    linkedin: 'https://linkedin.com/in/pankajjaiswal', 
    portfolio: 'https://pankajjaiswal.vercel.app' 
  });
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showManageSkills, setShowManageSkills] = useState(false);
  const [showManageProjects, setShowManageProjects] = useState(false);
  const [showManageWorkExperience, setShowManageWorkExperience] = useState(false);
  const [showManageProjectLinks, setShowManageProjectLinks] = useState(false);

  // Form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupEducation, setSignupEducation] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newWorkExp, setNewWorkExp] = useState({
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [editingWorkExp, setEditingWorkExp] = useState<WorkExperience | null>(null);

  // Project skills state
  const [selectedProjectForSkills, setSelectedProjectForSkills] = useState<Project | null>(null);
  const [selectedProjectSkills, setSelectedProjectSkills] = useState<Skill[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [skillsCurrentPage, setSkillsCurrentPage] = useState(1);
  const [searchSkill, setSearchSkill] = useState('');
  const projectsPerPage = 6;
  const skillsPerPage = 3;
  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const totalSkillsPages = Math.ceil(skills.length / skillsPerPage);

  // Fetch data on mount and when token changes
  useEffect(() => {
    if (token && isLoggedIn) {
      // User is logged in - fetch their data with auth
      profileApi.fetchData('/profile', token).then((data) => data && setProfile(data));
      profileApi.fetchData('/profile-links', token).then((data) => {
        if (data && data.length > 0) {
          setProfileLinks(data[0]);
        }
      });
      workExpApi.fetchData('/work-experience', token).then((data) => data && setWorkExperience(data));
    } else {
      // No token - fetch default public profile and links
      profileApi.fetchData('/profile/public/default').then((data) => data && setProfile(data));
      profileApi.fetchData('/profile-links/public/default').then((data) => {
        if (data && data.length > 0) {
          setProfileLinks(data[0]);
        }
      });
      setWorkExperience([]);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    projectsApi.fetchData('/projects').then((data) => {
      if (data) {
        setAllProjects(data);
        setProjects(data.slice(0, projectsPerPage));
        setCurrentPage(1);
      }
    });
    skillsApi.fetchData('/skills').then((data) => data && setSkills(data));
  }, []);

  // Project loading and pagination
  const loadProjects = async () => {
    projectsApi.fetchData('/projects').then((data) => {
      if (data) {
        setAllProjects(data);
        setProjects(data.slice(0, projectsPerPage));
        setCurrentPage(1);
        setSearchSkill('');
      }
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const start = (page - 1) * projectsPerPage;
      setProjects(allProjects.slice(start, start + projectsPerPage));
    }
  };

  const searchBySkill = async () => {
    if (!searchSkill.trim()) {
      setError('Please enter a skill to search');
      return;
    }
    projectsApi.fetchData(`/projects?skill=${encodeURIComponent(searchSkill)}`).then((data) => {
      if (data) {
        setAllProjects(data);
        setProjects(data.slice(0, projectsPerPage));
        setCurrentPage(1);
      }
    });
  };

  // Profile management
  const refreshProfile = () => {
    profileApi.fetchData('/profile', token || undefined).then((data) => data && setProfile(data));
  };

  const openEditProfile = () => {
    if (profile) {
      setEditName(profile.name);
      setEditEmail(profile.email);
      setEditEducation(profile.education);
      setShowEditProfile(true);
    }
  };

  const updateProfile = async () => {
    if (!token) return;
    const result = await profileApi.sendRequest('/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        email: editEmail,
        education: editEducation,
      }),
    });
    if (result) {
      setProfile({ id: profile?.id || 1, name: editName, email: editEmail, education: editEducation });
      setShowEditProfile(false);
    }
  };

  // Skills management
  const addSkill = async () => {
    if (!newSkillName.trim()) return;
    const result = await skillsApi.sendRequest('/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSkillName }),
    });
    if (result) {
      setNewSkillName('');
      refreshSkills();
    }
  };

  const updateSkill = async () => {
    if (!editingSkill || !newSkillName.trim()) return;
    const result = await skillsApi.sendRequest(`/skills/${editingSkill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSkillName }),
    });
    if (result) {
      setEditingSkill(null);
      setNewSkillName('');
      refreshSkills();
    }
  };

  const deleteSkill = async (skillId: number) => {
    if (!confirm('Delete this skill?')) return;
    await skillsApi.sendRequest(`/skills/${skillId}`, { method: 'DELETE' });
    refreshSkills();
  };

  const refreshSkills = () => {
    skillsApi.fetchData('/skills').then((data) => data && setSkills(data));
  };

  // Projects management
  const addProject = async () => {
    if (!newProjectTitle.trim()) return;
    const result = await projectsApi.sendRequest('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newProjectTitle,
        description: newProjectDescription,
      }),
    });
    if (result) {
      setNewProjectTitle('');
      setNewProjectDescription('');
      loadProjects();
    }
  };

  const updateProject = async () => {
    if (!editingProject || !newProjectTitle.trim()) return;
    const result = await projectsApi.sendRequest(`/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newProjectTitle,
        description: newProjectDescription,
      }),
    });
    if (result) {
      setEditingProject(null);
      setNewProjectTitle('');
      setNewProjectDescription('');
      loadProjects();
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!confirm('Delete this project?')) return;
    await projectsApi.sendRequest(`/projects/${projectId}`, { method: 'DELETE' });
    loadProjects();
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProjectTitle(project.title);
    setNewProjectDescription(project.description);
  };

  // Project skills
  const loadProjectSkills = async (project: Project) => {
    setSelectedProjectForSkills(project);
    const response = await fetch(`${API_URL}/project-skills/project/${project.id}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedProjectSkills(data);
    }
  };

  const addSkillToProject = async (skillId: number) => {
    if (!selectedProjectForSkills) return;
    const response = await fetch(`${API_URL}/project-skills/project/${selectedProjectForSkills.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    });
    if (response.ok) {
      loadProjectSkills(selectedProjectForSkills);
      refreshSkills();
    }
  };

  const removeSkillFromProject = async (skillId: number) => {
    if (!selectedProjectForSkills) return;
    const response = await fetch(
      `${API_URL}/project-skills/project/${selectedProjectForSkills.id}/skill/${skillId}`,
      { method: 'DELETE' }
    );
    if (response.ok) {
      loadProjectSkills(selectedProjectForSkills);
      refreshSkills();
    }
  };

  // Work experience
  const addWorkExperience = async () => {
    if (!newWorkExp.company.trim() || !newWorkExp.role.trim()) {
      setError('Company and role are required');
      return;
    }
    if (!newWorkExp.start_date) {
      setError('Start date is required');
      return;
    }
    if (!profile?.id) {
      setError('Profile not loaded');
      return;
    }
    
    try {
      const result = await workExpApi.sendRequest('/work-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newWorkExp, profile_id: profile.id }),
      });
      if (result) {
        setNewWorkExp({ company: '', role: '', start_date: '', end_date: '', description: '' });
        setWorkExperience([...workExperience, result]);
        setError(null);
      }
    } catch (err) {
      setError(workExpApi.error || 'Failed to add work experience');
    }
  };

  const updateWorkExperience = async () => {
    if (!editingWorkExp || !newWorkExp.company.trim() || !newWorkExp.role.trim()) return;
    if (!newWorkExp.start_date) {
      setError('Start date is required');
      return;
    }
    try {
      const result = await workExpApi.sendRequest(`/work-experience/${editingWorkExp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkExp),
      });
      if (result) {
        setWorkExperience(workExperience.map((w) => (w.id === editingWorkExp.id ? result : w)));
        setEditingWorkExp(null);
        setNewWorkExp({ company: '', role: '', start_date: '', end_date: '', description: '' });
        setError(null);
      }
    } catch (err) {
      setError(workExpApi.error || 'Failed to update work experience');
    }
  };

  const deleteWorkExperience = async (id: number) => {
    if (!confirm('Delete this experience?')) return;
    await workExpApi.sendRequest(`/work-experience/${id}`, { method: 'DELETE' });
    setWorkExperience(workExperience.filter((w) => w.id !== id));
  };

  const startEditWorkExperience = (exp: WorkExperience) => {
    setEditingWorkExp(exp);
    setNewWorkExp({
      company: exp.company,
      role: exp.role,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      description: exp.description,
    });
  };

  // Auth
  const handleLogin = async () => {
    const result = await login(loginUsername, loginPassword);
    if (result) {
      setShowLogin(false);
      setLoginUsername('');
      setLoginPassword('');
      // Display user's profile from login response
      if (result.profile) {
        setProfile(result.profile);
      }
      setError(null);
    } else {
      setError('Login failed');
    }
  };

  const handleSignup = async () => {
    if (!signupUsername || !signupPassword || !signupName || !signupEmail) {
      setError('Please fill in all required fields');
      return;
    }
    const result = await signup(signupUsername, signupPassword, signupName, signupEmail, signupEducation);
    if (result) {
      setShowSignup(false);
      // Display user's profile from signup response
      if (result.profile) {
        setProfile(result.profile);
      }
      // Clear form
      setSignupUsername('');
      setSignupPassword('');
      setSignupName('');
      setSignupEmail('');
      setSignupEducation('');
      setError(null);
    } else {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="app">
      <div className="dashboard-grid">
        <ProfileSection
          profile={profile}
          profileLinks={profileLinks}
          profileError={profileApi.error}
          loading={profileApi.loading}
          isLoggedIn={isLoggedIn}
          onEdit={openEditProfile}
          onSkillsClick={() => {
            setShowManageSkills(true);
          }}
          onProjectsClick={() => {
            setShowManageProjects(true);
          }}
          onExperienceClick={() => setShowManageWorkExperience(true)}
          onLogout={logout}
          onLogin={() => setShowLogin(true)}
          onSignup={() => setShowSignup(true)}
          onRefresh={refreshProfile}
        />
        <SkillsSidebar
          skills={skills}
          loading={skillsApi.loading}
          currentPage={skillsCurrentPage}
          totalPages={totalSkillsPages}
          onPageChange={setSkillsCurrentPage}
          skillsPerPage={skillsPerPage}
        />
      </div>

      <ErrorDisplay message={error} onDismiss={() => setError(null)} />

      <ProjectsSection
        projects={projects}
        allProjects={allProjects}
        loading={projectsApi.loading}
        currentPage={currentPage}
        totalPages={totalPages}
        searchSkill={searchSkill}
        onSearch={searchBySkill}
        onClearSearch={() => {
          setSearchSkill('');
          loadProjects();
        }}
        onSearchChange={setSearchSkill}
        onRefresh={loadProjects}
        onPageChange={goToPage}
        isLoggedIn={isLoggedIn}
        onEditLinks={() => setShowManageProjectLinks(true)}
      />

      <WorkExperienceSection
        experiences={workExperience}
        isLoggedIn={isLoggedIn}
        onEdit={(exp) => {
          startEditWorkExperience(exp);
          setShowManageWorkExperience(true);
        }}
        onDelete={deleteWorkExperience}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        username={loginUsername}
        password={loginPassword}
        onUsernameChange={setLoginUsername}
        onPasswordChange={setLoginPassword}
        onLogin={handleLogin}
        loading={authLoading}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        username={signupUsername}
        password={signupPassword}
        name={signupName}
        email={signupEmail}
        education={signupEducation}
        onUsernameChange={setSignupUsername}
        onPasswordChange={setSignupPassword}
        onNameChange={setSignupName}
        onEmailChange={setSignupEmail}
        onEducationChange={setSignupEducation}
        onSignup={handleSignup}
        loading={authLoading}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        name={editName}
        email={editEmail}
        education={editEducation}
        onNameChange={setEditName}
        onEmailChange={setEditEmail}
        onEducationChange={setEditEducation}
        onUpdate={updateProfile}
        loading={profileApi.loading}
      />

      <ManageSkillsModal
        isOpen={showManageSkills}
        onClose={() => setShowManageSkills(false)}
        skills={skills}
        skillName={newSkillName}
        editingSkill={editingSkill}
        onSkillNameChange={setNewSkillName}
        onAdd={addSkill}
        onUpdate={updateSkill}
        onDelete={deleteSkill}
        onEdit={(skill) => {
          setEditingSkill(skill);
          setNewSkillName(skill.name);
        }}
        onCancelEdit={() => {
          setEditingSkill(null);
          setNewSkillName('');
        }}
        loading={skillsApi.loading}
      />

      <ManageProjectsModal
        isOpen={showManageProjects}
        onClose={() => {
          setShowManageProjects(false);
          setSelectedProjectForSkills(null);
          setSelectedProjectSkills([]);
        }}
        projects={allProjects}
        allSkills={skills}
        projectTitle={newProjectTitle}
        projectDescription={newProjectDescription}
        editingProject={editingProject}
        selectedProject={selectedProjectForSkills}
        selectedProjectSkills={selectedProjectSkills}
        onProjectTitleChange={setNewProjectTitle}
        onProjectDescriptionChange={setNewProjectDescription}
        onAdd={addProject}
        onUpdate={updateProject}
        onDelete={deleteProject}
        onEdit={startEditProject}
        onCancelEdit={() => {
          setEditingProject(null);
          setNewProjectTitle('');
          setNewProjectDescription('');
        }}
        onProjectSelect={loadProjectSkills}
        onAddSkill={addSkillToProject}
        onRemoveSkill={removeSkillFromProject}
        loading={projectsApi.loading}
      />

      <ManageWorkExperienceModal
        isOpen={showManageWorkExperience}
        onClose={() => setShowManageWorkExperience(false)}
        experiences={workExperience}
        company={newWorkExp.company}
        role={newWorkExp.role}
        startDate={newWorkExp.start_date}
        endDate={newWorkExp.end_date}
        description={newWorkExp.description}
        editingExp={editingWorkExp}
        isLoggedIn={isLoggedIn}
        onCompanyChange={(company) => setNewWorkExp({ ...newWorkExp, company })}
        onRoleChange={(role) => setNewWorkExp({ ...newWorkExp, role })}
        onStartDateChange={(start_date) => setNewWorkExp({ ...newWorkExp, start_date })}
        onEndDateChange={(end_date) => setNewWorkExp({ ...newWorkExp, end_date })}
        onDescriptionChange={(description) => setNewWorkExp({ ...newWorkExp, description })}
        onAdd={addWorkExperience}
        onUpdate={updateWorkExperience}
        onDelete={deleteWorkExperience}
        onEdit={startEditWorkExperience}
        onCancelEdit={() => {
          setEditingWorkExp(null);
          setNewWorkExp({ company: '', role: '', start_date: '', end_date: '', description: '' });
        }}
        loading={workExpApi.loading}
      />

      <ManageProjectLinksModal
        isOpen={showManageProjectLinks}
        onClose={() => setShowManageProjectLinks(false)}
        projects={allProjects}
        onSave={async (updates: { projectId: number; url: string }[]) => {
          try {
            for (const update of updates) {
              await fetch(`${API_URL}/project-links/${update.projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: update.url }),
              });
            }
            await loadProjects();
            setError(null);
          } catch (err) {
            setError('Failed to update project links');
          }
        }}
      />

      <Footer apiUrl={API_URL} />
    </div>
  );
}

export default App;
