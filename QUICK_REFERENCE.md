# 🎯 SceneMap - Quick Reference Card

## 🚀 Dev Server
**URL:** http://localhost:5174
**Status:** ✅ Running

---

## 📍 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign in page |
| `/signup` | Public | Registration page ⭐ NEW |
| `/dashboard` | Protected | Main dashboard |
| `/` | Protected | Redirects to dashboard |

---

## 🔑 Test Credentials

### Quick Login (Demo Mode)
```
Email:    anything@test.com
Password: anything
```
Accepts ANY credentials in demo mode!

### Sample Signup
```
Full Name:        Sarah Johnson
Email:            sarah.johnson@metro.gov
Badge Number:     Leave blank (auto-generates)
Department:       Metro PD
Password:         test123
Confirm Password: test123
```

---

## 🎨 Theme Colors

```css
Background:  #0a0b0f (Deep black)
Cards:       #16171d (Dark gray)
Borders:     #2e303a (Subtle gray)
Text:        #9ca3af (Light gray)
Headings:    #f3f4f6 (White)
Accent:      #fbbf24 (Police yellow) ⭐
Hover:       #f59e0b (Orange gold)
```

---

## 📁 Key Files

### Components
- `Layout.jsx` - Header/nav/footer
- `ProtectedRoute.jsx` - Auth guard

### Pages
- `Login.jsx` - Sign in
- `Signup.jsx` - Register ⭐ NEW
- `Dashboard.jsx` - Main view

### State
- `AuthContext.jsx` - Auth management
  - `login()` method
  - `signup()` method ⭐ NEW
  - `logout()` method

### Routes
- `App.jsx` - Router config

---

## 🔄 User Flows

### New User
```
/signup → Fill form → Dashboard
```

### Returning User
```
/login → Enter creds → Dashboard
```

### Navigation
```
Login ←→ Signup (bidirectional links)
Dashboard → Logout → Login
```

---

## 💾 localStorage Keys

```javascript
currentUser  // User object
authToken    // JWT-like token
```

### Clear Session
```javascript
localStorage.clear()
location.reload()
```

---

## ✅ Features Checklist

### Authentication
- [x] Login page
- [x] Signup page ⭐ NEW
- [x] Logout function
- [x] Session persistence
- [x] Protected routes
- [x] Auto-login on refresh

### UI/UX
- [x] Dark theme
- [x] Evidence marker logo
- [x] Loading states
- [x] Error messages
- [x] Form validation
- [x] Hover effects
- [x] Responsive design

### Data Management
- [x] LocalStorage persistence
- [x] Auth context provider
- [x] Auto-badge generation
- [x] User profile storage

---

## 🐛 Common Issues

### Can't access dashboard
→ Make sure you're logged in

### Session lost
→ Check if browser allows localStorage

### Port conflict
→ Vite auto-selects next port (check terminal)

### Styles not loading
→ Hard refresh (Ctrl+F5)

---

## 📊 Quick Stats

- **Routes:** 4
- **Components:** 7
- **Pages:** 3 (Login, Signup, Dashboard)
- **CSS Files:** 4
- **Auth Methods:** 3
- **Total Features:** 15+

---

## 🎬 5-Minute Demo

```
1. Open http://localhost:5174/signup     (30s)
   → Show registration form
   
2. Create account                         (1m)
   → Fill form, show auto-badge
   
3. View dashboard                         (1m)
   → Show stats, quick actions
   
4. Logout and login                       (1m)
   → Show returning user flow
   
5. Refresh page                           (30s)
   → Show session persistence
   
6. Mobile view                            (1m)
   → Resize browser, show responsive
```

---

## 🔧 Dev Commands

```bash
# Start server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## 📝 Quick Notes

- All auth is **mock/demo mode**
- Backend integration ready
- Mobile-first responsive
- Dark theme only (no light mode)
- Evidence marker = yellow badge logo
- Auto-generates badge numbers
- Session persists in localStorage

---

## 🎯 Next Integration

Replace mock auth in `AuthContext.jsx`:
```javascript
// Mock
const signup = (formData) => { ... }

// Real
const signup = async (formData) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  return await res.json();
}
```

---

## ✨ What's Complete

✅ Login system
✅ Signup system ⭐ NEW
✅ Dashboard
✅ Navigation
✅ Session management
✅ Form validation
✅ Responsive design
✅ Dark theme
✅ Error handling
✅ Loading states

---

**Status:** COMPLETE & RUNNING
**URL:** http://localhost:5174
**Docs:** See QUICKSTART.md & UPDATED_FEATURES.md
