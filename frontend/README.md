# API Playground Frontend

A modern, responsive React-based frontend for managing your personal portfolio. Built with TypeScript, Vite, and custom React hooks for efficient state management and API communication.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Custom Hooks](#custom-hooks)
- [Styling & Theme](#styling--theme)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Pagination](#pagination)
- [Troubleshooting](#troubleshooting)
- [Building for Production](#building-for-production)

## 🎯 Overview

This frontend application provides a beautiful, intuitive interface for:

- 👤 **Profile Management** - View/edit personal information and social links
- 💼 **Work Experience** - Manage employment history with pagination
- 🛠️ **Skills** - Add/remove technical skills
- 📁 **Projects** - Create and manage portfolio projects
- 🔍 **Search** - Filter projects by skills
- 🔐 **Authentication** - Secure login/logout system
- 🎨 **Modern UI** - Responsive design with orange/blue theme

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Backend API** running on `http://localhost:3000`
- Basic knowledge of React and TypeScript

## 📦 Installation & Setup

### 1. Navigate to Frontend Folder

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

The frontend is configured to connect to `http://localhost:3000` by default. If your backend runs on a different URL, update the API base URL in:

**File**: `src/hooks/useApi.ts`

```typescript
const BASE_URL = "http://localhost:3000"; // Change if needed
```

### 4. Start Development Server

```bash
npm start
```

Or use the Vite dev server:

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

Features:
- Hot Module Replacement (HMR) - Auto-refresh on file changes
- Source maps for debugging
- Development logging

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## ✨ Features

### 1. **Profile Section**
- Display personal information (name, email, education)
- Social media links (GitHub, LinkedIn, Portfolio)
- Edit profile details when logged in
- Visual indicators for login status

### 2. **Work Experience**
- View all work experiences in a paginated list
- 3 items per page with pagination controls
- Display company, role, dates, and description
- Add new work experience entries
- Edit existing entries
- Delete entries
- Automatic page adjustment when deleting items

### 3. **Skills Management**
- View all technical skills
- Add new skills
- Remove existing skills
- Visual skill badges with dark text

### 4. **Projects Portfolio**
- Browse all projects with pagination (5 per page)
- Filter projects by skill
- Display project title and description
- Project links and associated skills
- Add new projects
- Edit and delete projects

### 5. **Authentication**
- Login modal with username/password
- JWT token-based authentication
- Token stored in localStorage
- Automatic logout functionality
- "Login to edit" messaging for unauthorized users

### 6. **Search & Filter**
- Search projects by specific skill
- Real-time filtering
- Clear search to view all projects
- Pagination resets on new search

### 7. **UI/UX**
- Responsive design (mobile, tablet, desktop)
- Orange (#e67e22) and blue (#4a90e2) color scheme
- Smooth animations and transitions
- Error messages and loading states
- Dark theme with light accents

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.tsx                    # Main component, state management
│   ├── App.css                    # Global styles
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Base styles
│   ├── components/
│   │   ├── ProfileSection.tsx     # Profile display & actions
│   │   ├── WorkExperienceSection.tsx # Work experience list
│   │   ├── SkillsSidebar.tsx      # Skills display
│   │   ├── ProjectsSection.tsx    # Projects grid & search
│   │   ├── Footer.tsx             # Footer component
│   │   ├── Modal.tsx              # Reusable modal wrapper
│   │   ├── ErrorDisplay.tsx       # Error message display
│   │   └── modals/
│   │       ├── LoginModal.tsx     # Login form
│   │       ├── EditProfileModal.tsx # Edit profile form
│   │       ├── ManageSkillsModal.tsx # Add/remove skills
│   │       ├── ManageProjectsModal.tsx # Create/edit projects
│   │       ├── ManageProjectLinksModal.tsx # Manage project links
│   │       └── ManageWorkExperienceModal.tsx # Add/edit work exp
│   ├── hooks/
│   │   ├── useApi.ts              # Custom hook for API calls
│   │   └── useAuth.ts             # Custom hook for auth state
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── public/                         # Static assets
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # ESLint configuration
└── package.json                   # Dependencies
```

## 🧩 Component Architecture

### App.tsx (Main Component)

The heart of the application. Manages:
- Global state (profile, projects, skills, work experience, etc.)
- API calls and data fetching
- Authentication state
- Modal visibility states
- Error handling and user feedback

**Key State Variables:**
```typescript
const [profile, setProfile] = useState<Profile | null>(null);
const [projects, setProjects] = useState<Project[]>([]);
const [allProjects, setAllProjects] = useState<Project[]>([]);
const [skills, setSkills] = useState<Skill[]>([]);
const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [token, setToken] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
```

### ProfileSection.tsx

Displays user profile and action buttons.

**Props:**
```typescript
interface ProfileSectionProps {
  profile: Profile | null;
  loading: boolean;
  isLoggedIn: boolean;
  profileLinks?: ProfileLink;
  onEdit: () => void;
  onSkillsClick: () => void;
  onProjectsClick: () => void;
  onExperienceClick: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onRefresh: () => void;
}
```

### WorkExperienceSection.tsx

Displays work experience with pagination (3 per page).

**Features:**
- Auto-adjust page when items deleted
- Previous/Next pagination buttons
- Numbered page buttons with active state

**Props:**
```typescript
interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  isLoggedIn: boolean;
  onEdit: (exp: WorkExperience) => void;
  onDelete: (id: number) => void;
}
```

### ProjectsSection.tsx

Displays projects with search and pagination (5 per page).

**Features:**
- Real-time skill search
- Pagination controls
- Edit/delete buttons when logged in

### Modal Components

All modal components follow same pattern:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
}
```

## 🎣 Custom Hooks

### useApi.ts

**Purpose:** Unified API communication with error handling

**Usage:**
```typescript
const api = useApi<DataType>();

// Fetch data
api.fetchData('/endpoint').then(data => {
  if (data) {
    // Handle data
  }
});

// Send request (POST, PUT, DELETE)
const result = await api.sendRequest('/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**Features:**
- Automatic error handling
- Loading state management
- Error message state
- Base URL configuration
- Token-based authentication

### useAuth.ts

**Purpose:** Authentication state management

**Usage:**
```typescript
const { isLoggedIn, token, login, logout } = useAuth();
```

**Features:**
- Login/logout functionality
- Token persistence in localStorage
- Automatic token restoration on page load

## 🎨 Styling & Theme

### Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Orange** | #e67e22 | Buttons, links, accents |
| **Primary Blue** | #4a90e2 | Secondary buttons |
| **Green** | #2ecc71 | Logout button |
| **Gold** | #d4af37 | Login/Refresh buttons |
| **Dark Grey** | #1a1a1a | Text, skill badges |
| **Light Grey** | #f5f5f5 | Backgrounds |
| **Dark BG** | #0f0f0f | Main background |

### CSS Organization

**App.css** contains:
- Global styles
- Component-specific styles (900+ lines)
- Responsive breakpoints
- Animations and transitions
- Theme variables

**Key Classes:**
- `.button` / `.btn` - Button styling
- `.card` / `.section` - Container styling
- `.modal` / `.modal-content` - Modal styling
- `.pagination` - Pagination controls

## 🔐 Authentication Flow

```
1. User clicks "Login" → LoginModal opens
2. User enters username/password → "Login" button clicked
3. Frontend sends POST to /auth/login
4. Backend validates and returns JWT token
5. Frontend stores token in localStorage
6. State updates: isLoggedIn = true
7. Logout button appears, Edit buttons enabled
8. Token included in Authorization header for all subsequent requests
```

### Token Management

```typescript
// Store token
localStorage.setItem('token', response.token);

// Retrieve token
const token = localStorage.getItem('token');

// Use in requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Logout - remove token
localStorage.removeItem('token');
```

## 🌐 API Integration

### Base URL

Default: `http://localhost:3000`

### API Call Pattern

```typescript
// Fetch data
const data = await api.fetchData('/endpoint');

// Send data
const result = await api.sendRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(payload)
});

// With authentication
const result = await api.sendRequest('/protected', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(payload)
});
```

### Error Handling

```typescript
try {
  const data = await api.fetchData('/endpoint');
  if (data) {
    // Success
  }
} catch (error) {
  // api.error contains error message
  setError(api.error || 'Failed to fetch data');
}
```

## 📄 Pagination

### Work Experience (3 items per page)

```typescript
const ITEMS_PER_PAGE = 3;
const totalPages = Math.ceil(experiences.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const paginatedItems = experiences.slice(startIndex, startIndex + ITEMS_PER_PAGE);
```

**Features:**
- Previous/Next buttons
- Numbered page buttons
- Auto-adjust to last page when items deleted
- Current page highlighted

### Projects (5 items per page)

Same logic with 5 items per page.

## 🆘 Troubleshooting

### "Cannot connect to backend"
```
Error: Failed to fetch
```
**Solution:**
- Ensure backend is running: `npm start` in backend folder
- Check port 3000 is accessible
- Verify BASE_URL in `useApi.ts`

### "Login failed"
```
Error: Invalid credentials
```
**Solution:**
- Run seed script in backend: `node seed-db.js`
- Default credentials are in seed data
- Check backend logs for details

### "Token expired"
**Solution:**
- Token is expired, login again
- Token stored in localStorage, persists across sessions

### "Edit/Add buttons don't work"
**Solution:**
- Must be logged in first (green "Logout" button visible)
- Check browser console for errors
- Verify backend API is responding

### "Pages don't update after adding items"
**Solution:**
- Check browser DevTools Network tab for API errors
- Verify response contains ID field
- Check console for error messages

### "Styling looks broken"
**Solution:**
- Clear browser cache: Ctrl+Shift+Del
- Hard refresh: Ctrl+F5
- Check App.css is loaded (Network tab)
- Verify no CSS conflicts

## 🏗️ Building for Production

### Create Optimized Build

```bash
npm run build
```

Outputs to `dist/` folder with:
- Minified CSS and JavaScript
- Optimized assets
- Source maps (optional)

### Deploy to Server

```bash
# Copy dist folder contents to web server
# Example: Copy to GitHub Pages, Vercel, Netlify, etc.
```

### Environment for Production

Update `.env` or `useApi.ts`:
```typescript
const BASE_URL = "https://your-api-domain.com"; // Production URL
```

## 📋 TypeScript Types

**Profile:**
```typescript
interface Profile {
  id: number;
  name: string;
  email: string;
  education: string;
}
```

**WorkExperience:**
```typescript
interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
}
```

**Project:**
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  project_url?: string;
}
```

**Skill:**
```typescript
interface Skill {
  id: number;
  name: string;
}
```

## 🚀 Performance Tips

1. **Use pagination** - Don't load all items at once
2. **Lazy load images** - Images load only when visible
3. **Memoization** - Use React.memo for expensive components
4. **Debounce search** - Avoid excessive API calls
5. **Code splitting** - Vite automatically handles this

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 📞 Support

For issues:
1. Check browser console for errors (F12)
2. Check Network tab in DevTools
3. Verify backend API is running
4. Review error messages carefully
5. Check this README's troubleshooting section

## 📄 License

ISC License - Feel free to use and modify

---

**Last Updated:** January 18, 2026
