export interface Profile {
  id: number;
  name: string;
  email: string;
  education: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  project_url?: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
}
