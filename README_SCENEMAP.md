# SceneMap - Interactive Field Evidence Logger

## Part 1: Authentication & Dashboard (COMPLETED ✅)

This is the first component of the SceneMap crime scene evidence tracking application. A dark-themed React application with authentication and protected routing.

### Features Implemented

#### 1. **Login Page** (`/login`)
- Clean, dark-themed login interface
- Email/password authentication form
- Form validation with error messages
- Loading states during authentication
- Demo mode (accepts any credentials)
- Responsive design for mobile devices

#### 2. **Dashboard** (`/dashboard`)
- Protected route requiring authentication
- Welcome section with officer information
- Stats display:
  - Active Cases
  - Evidence Pins
  - Scene Photos
  - Last Activity
- Quick Actions section with buttons for:
  - Create New Case
  - View Active Cases
  - Case Timeline
- Recent Activity section (empty state ready for data)

#### 3. **Authentication System**
- React Context-based auth state management
- LocalStorage persistence for:
  - Current user information
  - Auth token
  - Session persistence across page refreshes
- Protected route component with loading states
- Automatic redirect to login when not authenticated

#### 4. **Layout & Navigation**
- Sticky header with SceneMap branding
- Evidence marker logo (yellow badge #1)
- Navigation menu (Dashboard, Cases, Timeline)
- User information display (name, badge number)
- Logout functionality
- Footer with authorization notice
- Responsive design for mobile/tablet

### Tech Stack
- **React 19** with Vite
- **React Router DOM** for routing
- **CSS3** with custom dark theme
- **LocalStorage** for auth persistence

### Design Theme
- **Background**: Deep dark (#0a0b0f, #16171d)
- **Accent Color**: Police yellow (#fbbf24) - evidence markers
- **Text**: Gray scale for hierarchy (#f3f4f6, #9ca3af)
- **Borders**: Subtle dark borders (#2e303a)


### File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main app layout with header/footer
│   │   └── ProtectedRoute.jsx   # Route guard component
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx            # Login page component
│   │   └── Dashboard.jsx        # Dashboard page component
│   ├── styles/
│   │   ├── Login.css            # Login page styles
│   │   ├── Dashboard.css        # Dashboard styles
│   │   └── Layout.css           # Layout & navigation styles
│   ├── App.jsx                  # Main app with routing
│   ├── index.css                # Global styles & theme
│   └── main.jsx                 # App entry point
```

### How to Use

#### Development
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5174 in your browser.

#### Login
Use any email and password combination to access the system (demo mode).

Example:
- Email: `officer.jones@dept.gov`
- Password: `anything`

The system will generate a badge number and welcome you to the dashboard.

#### Features to Test
1. ✅ Login with any credentials
2. ✅ Navigate to dashboard
3. ✅ View officer information in header
4. ✅ Click navigation links
5. ✅ Logout and return to login
6. ✅ Refresh page - session persists
7. ✅ Try accessing /dashboard without login - redirects to /login

### Next Steps (Parts 2 & 3)
1. **Case Management**
   - Create new case functionality
   - Upload scene images
   - Case list view

2. **Interactive Evidence Mapping**
   - Clickable canvas for evidence pins
   - Coordinate tracking (X/Y percentages)
   - Evidence detail modal

3. **Backend Integration**
   - Connect to API endpoints
   - Real authentication
   - Database persistence

### Notes for Developers
- All routes except `/login` are protected
- Auth state is stored in localStorage (keys: `currentUser`, `authToken`)
- The app uses React Router's `<Outlet />` pattern for nested routes
- Dark theme variables are defined in `index.css` `:root`
- Evidence marker logo uses the police yellow accent color

---

**Built for:** SceneMap Hackathon - Crime Scene Evidence Tracking
**Status:** Part 1 Complete ✅
**Demo Ready:** Yes
