# 🚨 SceneMap - Quick Start Guide

## What's Built (Part 1 - Complete ✅)

A dark-themed crime scene evidence tracking web app with:
- ✅ Professional login page
- ✅ Protected dashboard with stats
- ✅ Authentication system with session persistence
- ✅ Navigation header with officer info
- ✅ Mobile-responsive design

---

## 🚀 Start the App (Already Running!)

The dev server is **ALREADY RUNNING** at:
```
http://localhost:5174
```

If you need to restart:
```bash
cd frontend
npm run dev
```

---

## 🔐 Login to the App

**Access:** http://localhost:5174/login

**Demo Credentials:** (accepts ANY email/password)
```
Email: officer.jones@dept.gov
Password: password123
```

The system will:
1. Generate a badge number (e.g., OFC-482)
2. Extract your name from email
3. Log you into the dashboard

---

## 📱 What You Can Test

### Login Page
- Enter any email and password
- See validation errors (if empty or invalid)
- Watch loading state during auth
- See "Demo: Use any email/password to login" note

### Dashboard
- View welcome section with your name
- See stats cards (Active Cases, Evidence Pins, etc.)
- Check quick action buttons
- See empty recent activity section

### Navigation
- Click "Dashboard" in header nav
- See your name and badge in top-right
- Click "Logout" to return to login

### Session Persistence
- Refresh the page → stays logged in
- Close and reopen browser → stays logged in
- Try accessing `/dashboard` directly → works if logged in
- Logout and try `/dashboard` → redirects to login

---

## 🎨 Design Features

### Police Evidence Theme
- **Yellow badges** - Crime scene evidence markers
- **Dark UI** - Professional law enforcement interface
- **Badge numbers** - Auto-generated officer IDs
- **Authorized access** - Security-focused messaging

### Evidence Marker Logo
The circular yellow badge with number "1" represents:
- Physical evidence markers at crime scenes
- Visual branding throughout the app
- Used in header and welcome section

---

## 📁 Project Structure

```
imageTracker/
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, ProtectedRoute
│   │   ├── contexts/        # AuthContext
│   │   ├── pages/           # Login, Dashboard
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Router setup
│   │   └── main.jsx         # Entry point
│   └── package.json
├── DEVELOPMENT_STATUS.md    # Project timeline
├── QUICKSTART.md           # This file
└── README.md
```

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router v6** - Routing
- **Vite** - Build tool & dev server
- **CSS3** - Custom dark theme
- **LocalStorage** - Session persistence

---

## 🔍 Key Files to Review

### Authentication
- `src/contexts/AuthContext.jsx` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route guard

### Pages
- `src/pages/Login.jsx` - Login form
- `src/pages/Dashboard.jsx` - Main dashboard

### Layout
- `src/components/Layout.jsx` - App shell with header/footer
- `src/App.jsx` - Route configuration

### Styles
- `src/index.css` - Global theme variables
- `src/styles/Login.css` - Login page styling
- `src/styles/Dashboard.css` - Dashboard styling
- `src/styles/Layout.css` - Header/nav styling

---

## 💾 Session Data (localStorage)

Check browser DevTools → Application → Local Storage:

```javascript
// currentUser
{
  "id": "1",
  "email": "officer.jones@dept.gov",
  "name": "officer.jones",
  "role": "Officer",
  "badge": "OFC-482"
}

// authToken
"mock-jwt-token-1718281600000"
```

---

## 🎯 Next Steps for Team

### Backend Developer (Part 2)
- Set up PostgreSQL/Supabase database
- Create cases and evidence_items tables
- Build REST API endpoints
- Replace mock auth with real auth

### Canvas Developer (Part 3)
- Build clickable image canvas
- Implement evidence pin placement
- Create evidence detail modal
- Build real-time timeline

### Integration
- Connect login to real API
- Fetch real stats for dashboard
- Implement case creation flow

---

## 📸 Visual Guide

### Login Screen
```
┌─────────────────────────────────┐
│     🟡 (1)  SceneMap           │
│  Interactive Field Evidence     │
│                                 │
│  Officer Email:                 │
│  [___________________]          │
│                                 │
│  Password:                      │
│  [___________________]          │
│                                 │
│  [   Access System    ]         │
│                                 │
│  Authorized Personnel Only      │
└─────────────────────────────────┘
```

### Dashboard Header
```
┌────────────────────────────────────────────────┐
│ 🟡(1) SceneMap | Dashboard Cases Timeline      │
│                         officer.jones  OFC-482 │
│                                   [Logout]      │
└────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Port Already in Use
If you see port conflict:
- Vite auto-selects next available port
- Check terminal output for actual port

### Can't Access Dashboard
- Make sure you're logged in
- Check localStorage has currentUser
- Try logging in again

### Styles Not Loading
- Clear browser cache
- Hard refresh (Ctrl+F5 / Cmd+Shift+R)
- Check dev server is running

### Session Lost on Refresh
- Check browser isn't in incognito mode
- Verify localStorage is enabled
- Check browser console for errors

---

## ✅ Testing Checklist

Before demo/handoff:

- [ ] Login with demo credentials
- [ ] Dashboard loads with stats
- [ ] User name shows in header
- [ ] Badge number displays
- [ ] Navigation links work
- [ ] Logout returns to login
- [ ] Refresh preserves session
- [ ] Mobile view works
- [ ] All hover states work
- [ ] No console errors

---

## 📞 Handoff to Other Developers

### For Backend Dev
**Needed from this part:**
- Auth flow expectations
- User data structure
- Token storage method
- API endpoints to create

**Files to review:**
- `AuthContext.jsx` - See mock login/logout
- `Login.jsx` - See form submission

### For Canvas Dev
**Needed from this part:**
- Layout structure
- Dashboard component
- Navigation patterns
- Styling approach

**Files to review:**
- `Layout.jsx` - Header/footer structure
- `Dashboard.jsx` - Stats and sections
- `Dashboard.css` - Styling patterns

---

## 🎉 Demo Script

1. **Open:** http://localhost:5174
2. **Show:** Login page with evidence marker logo
3. **Login:** Enter officer.jones@dept.gov / password123
4. **Highlight:** Auto-generated badge number
5. **Show:** Dashboard stats (ready for real data)
6. **Show:** Quick action buttons (ready for click handlers)
7. **Show:** Navigation and officer info in header
8. **Test:** Refresh page → session persists
9. **Show:** Logout → back to login screen
10. **Explain:** Ready for backend integration

---

**Status:** Part 1 Complete ✅
**Demo Ready:** Yes
**Server:** Running on http://localhost:5174
**Next:** Backend API & Interactive Canvas
