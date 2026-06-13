# SceneMap Component Guide

## Authentication Flow

### Login Process
1. User visits `/login` or any protected route (gets redirected)
2. Enters email and password
3. Form validates input
4. `AuthContext.login()` creates mock user data
5. User + token stored in localStorage
6. Redirects to `/dashboard`

### Logout Process
1. User clicks "Logout" button in header
2. `AuthContext.logout()` clears state
3. localStorage cleared
4. Redirects to `/login`

---

## Component Architecture

### AuthContext (`contexts/AuthContext.jsx`)
**Purpose:** Global authentication state management

**State:**
- `currentUser` - User object with id, email, name, role, badge
- `authToken` - JWT-like token string
- `isLoading` - Loading state on app mount
- `isAuthenticated` - Boolean computed from currentUser

**Methods:**
- `login(email, password)` - Mock authentication
- `logout()` - Clear auth state

**Storage:**
- Persists to localStorage on login
- Loads from localStorage on app mount

---

### ProtectedRoute (`components/ProtectedRoute.jsx`)
**Purpose:** Route guard for authenticated pages

**Logic:**
1. If loading → Show loading spinner
2. If authenticated → Render children
3. If not authenticated → Redirect to `/login`

**Usage:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

### Layout (`components/Layout.jsx`)
**Purpose:** Main app shell with header, content area, footer

**Structure:**
- **Header:** Logo, navigation, user info, logout
- **Main:** `<Outlet />` for nested routes
- **Footer:** Copyright and authorization notice

**Features:**
- Active link highlighting
- User name and badge display
- Responsive mobile menu

---

### Login Page (`pages/Login.jsx`)
**Purpose:** Authentication entry point

**Form Fields:**
- Email (with validation)
- Password (masked input)

**States:**
- Loading state during authentication
- Error messages for validation/auth failures

**Design Elements:**
- Evidence marker logo
- SceneMap title
- "Authorized Personnel Only" footer
- Demo credentials hint

---

### Dashboard Page (`pages/Dashboard.jsx`)
**Purpose:** Main landing page after login

**Sections:**

1. **Welcome Banner**
   - Large evidence marker with star
   - Officer name
   - Badge number and role

2. **Stats Grid**
   - Active Cases (0)
   - Evidence Pins (0)
   - Scene Photos (0)
   - Last Activity (Just now)

3. **Quick Actions**
   - Create New Case (primary button)
   - View Active Cases
   - Case Timeline

4. **Recent Activity**
   - Empty state with helpful message
   - Ready for timeline data

---

## Styling Architecture

### Global Styles (`index.css`)
- CSS variables in `:root` for theming
- Dark color scheme
- Base element styles
- Custom scrollbar

### Component Styles
Each page/component has dedicated CSS file:
- `Login.css` - Login page specific
- `Dashboard.css` - Dashboard specific
- `Layout.css` - Header/footer/nav

### Design Tokens
```css
--bg: #0a0b0f           /* Main background */
--bg-card: #16171d      /* Card background */
--border: #2e303a       /* Border color */
--text: #9ca3af         /* Body text */
--text-h: #f3f4f6       /* Heading text */
--accent: #fbbf24       /* Police yellow */
--accent-hover: #f59e0b /* Hover state */
```

---

## Evidence Marker Logo

### Visual Design
- Circular yellow badge (#fbbf24)
- Black number/icon in center
- Double-ring border effect
- Drop shadow for depth

### Sizes
- **Small** (Header): 36px - Shows "1"
- **Large** (Dashboard): 80px - Shows "★"

### Implementation
```jsx
<div className="evidence-marker-small">
  <span className="marker-number">1</span>
</div>
```

---

## Responsive Breakpoints

### Mobile (<768px)
- Stacked layout
- Full-width buttons
- Simplified navigation
- Hidden user info in header

### Tablet (768px-1024px)
- Adjusted padding
- Grid maintains columns where possible

### Desktop (>1024px)
- Full layout
- Multi-column grids
- All features visible

---

## Mock Data Structure

### Current User (from AuthContext)
```javascript
{
  id: '1',
  email: 'officer@dept.gov',
  name: 'officer',           // Extracted from email
  role: 'Officer',
  badge: 'OFC-482'          // Random generated
}
```

### Auth Token
```javascript
'mock-jwt-token-1234567890'
```

---

## Testing Checklist

### Authentication
- [x] Login with any email/password
- [x] Logout clears session
- [x] Refresh preserves session
- [x] Protected route redirects when not authed
- [x] Can't access /dashboard without login

### Navigation
- [x] Logo link goes to dashboard
- [x] Dashboard nav link shows as active
- [x] User name displays in header
- [x] Badge number displays correctly

### Responsive Design
- [x] Login page on mobile
- [x] Dashboard on mobile
- [x] Navigation collapses properly
- [x] Buttons stack on mobile

### Visual Polish
- [x] Evidence marker logo renders
- [x] Yellow accent color theme
- [x] Dark background consistent
- [x] Hover states work
- [x] Loading spinner displays

---

## Browser DevTools Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('currentUser')
localStorage.getItem('authToken')
```

### Clear Session (Force Logout)
```javascript
localStorage.clear()
location.reload()
```

### View React Context
Use React DevTools to inspect AuthContext provider state.

---

## Future Integration Points

### For Backend Developer
Replace `AuthContext.login()` with:
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### For Canvas Developer
Dashboard stats will pull from:
- Active Cases → `/api/cases?status=active`
- Evidence Pins → `/api/evidence/count`
- Recent Activity → `/api/activity?limit=5`

---

**Component Status:** All working ✅
**Ready for Integration:** Yes
**Demo Ready:** Yes
