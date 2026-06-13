# 🔍 SceneMap - Interactive Crime Scene Evidence Tracker

A full-stack web application for law enforcement to map and track evidence at crime scenes using interactive image pins.

---

## 🎯 Core Feature: Click-to-Pin Evidence Mapping

Investigators can click directly on crime scene photos to drop numbered evidence markers. Pins use **percentage-based positioning** to stay accurate regardless of screen size or zoom level.

### Key Capabilities
- ✅ **Interactive Pin Placement** - Click scene photos to mark evidence locations
- ✅ **Percentage Coordinates** - Pins maintain position across all devices
- ✅ **Evidence Metadata** - Track item name, bag number, category, description
- ✅ **Auto-Numbering** - Sequential pin numbers (1, 2, 3...) per case
- ✅ **Real-time Updates** - Instant pin rendering and sidebar updates
- ✅ **Mobile Responsive** - Works on tablets and phones in the field

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Start Development Servers

**Terminal 1 - Backend:**
```cmd
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm install
npm run dev
```

### Access Application
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## 📖 User Workflow

### 1. Create Account
- Navigate to signup page
- Enter name, email, password, badge number, department
- Automatic login after signup

### 2. Create Case
- Click "Create New Case"
- Fill case details (title, location, priority)
- **Upload scene photo** (required for pin mapping)
- Submit

### 3. Map Evidence
- Open case detail
- Click "Evidence & Relationships" button
- **Click anywhere on scene photo** to add evidence pin
- Fill evidence details:
  - Item name (required)
  - Evidence bag serial number
  - Category (weapon, biological, trace, etc.)
  - Description
  - Collected by
- Pin appears with auto-assigned number

### 4. View Evidence
- **Click existing pins** to view details
- Or click items in sidebar
- View all metadata and timestamps
- Delete pins if needed

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling framework
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose ODM)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

---

## 📁 Project Structure

```
imageTracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Case.js               # Case schema
│   │   │   └── Evidence.js           # Evidence schema ⭐
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth endpoints
│   │   │   ├── cases.js              # Case endpoints
│   │   │   └── evidence.js           # Evidence endpoints ⭐
│   │   └── index.js                  # Server entry point
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── kill-port.cmd                 # Utility script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Main layout
│   │   │   └── ProtectedRoute.jsx    # Auth guard
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Signup.jsx            # Signup page
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── Cases.jsx             # Cases list
│   │   │   ├── CreateCase.jsx        # Create case form
│   │   │   ├── CaseDetail.jsx        # Case details
│   │   │   ├── Evidence.jsx          # Evidence map ⭐
│   │   │   └── Timeline.jsx          # Activity timeline
│   │   ├── App.jsx                   # Router config
│   │   └── main.jsx                  # Entry point
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── tailwind.config.js            # Tailwind config
│
├── EVIDENCE_PIN_FEATURE.md           # Feature documentation
├── IMPLEMENTATION_SUMMARY.md          # Implementation details
├── QUICK_START.md                     # Quick start guide
├── STARTUP_GUIDE.md                   # Detailed setup
├── TROUBLESHOOTING_CHECKLIST.md       # Error solutions
├── TESTING_CHECKLIST.md               # Testing guide
└── README.md                          # This file
```

⭐ = Core pin mapping feature files

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend `.env` (Optional)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Database Schema

### Evidence Collection
```javascript
{
  caseId: ObjectId,              // Reference to parent case
  pinNumber: Number,             // Auto-incremented (1, 2, 3...)
  pinXPercent: Number,           // X position as % (0-100)
  pinYPercent: Number,           // Y position as % (0-100)
  itemName: String,              // Required
  bagSerialNumber: String,       // Optional
  category: String,              // Enum: weapon|biological|trace|...
  description: String,           // Optional
  collectedBy: String,           // Optional
  createdAt: Date                // Auto-timestamp
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/signup          # Create new user
POST /api/auth/login           # Login user
```

### Cases
```
GET  /api/cases                # List user's cases
POST /api/cases                # Create case
GET  /api/cases/:id            # Get case detail
PATCH /api/cases/:id           # Update case status
```

### Evidence (Pin Mapping)
```
GET    /api/evidence/case/:caseId    # Get all evidence for case
POST   /api/evidence                 # Create evidence pin
PATCH  /api/evidence/:id             # Update evidence
DELETE /api/evidence/:id             # Delete evidence
```

**All endpoints require JWT authentication in header:**
```
Authorization: Bearer <token>
```

---

## 🎨 Pin Positioning Math

### How It Works
```javascript
// When user clicks image
const rect = imageRef.current.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;

// Convert to percentages
const xPercent = (x / rect.width) * 100;
const yPercent = (y / rect.height) * 100;

// Store in database: { pinXPercent: 42.5, pinYPercent: 67.8 }

// Render with CSS
<div style={{ left: '42.5%', top: '67.8%' }}>
  <div className="pin-marker">1</div>
</div>
```

### Why Percentages?
- ✅ Resolution-independent
- ✅ Works on any screen size
- ✅ Maintains accuracy when zooming
- ✅ Perfect for mobile devices

---

## 🎯 Evidence Categories

| Category | Use Case |
|----------|----------|
| **Weapon** | Firearms, knives, blunt objects |
| **Biological** | Blood, DNA, bodily fluids |
| **Trace** | Fibers, hair, particles, residue |
| **Document** | Papers, notes, records |
| **Digital** | Phones, computers, storage devices |
| **Impression** | Fingerprints, shoe prints, tire tracks |
| **Other** | Miscellaneous evidence |

---

## 🧪 Testing

### Run Tests
```cmd
# See detailed testing checklist
TESTING_CHECKLIST.md
```

### Key Test Areas
1. User authentication (signup/login)
2. Case creation with image upload
3. Pin creation at different positions
4. Pin viewing and deletion
5. Positioning accuracy (resize, zoom)
6. Data persistence
7. Mobile responsiveness
8. Error handling

---

## 🐛 Troubleshooting

### Backend Won't Start
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```cmd
# Kill process on port 5000
cd backend
kill-port.cmd
# Or manually:
netstat -ano | findstr :5000
taskkill /PID [number] /F
```

### Database Not Connected
**Error:** `IP isn't whitelisted` or `database: disconnected`

**Solution:**
1. Database owner must whitelist IP in MongoDB Atlas
2. Go to: https://cloud.mongodb.com/
3. Navigate to: Network Access → Add IP Address
4. Add: `0.0.0.0/0` (for development)
5. Wait 1-3 minutes for changes to apply

### Pins Don't Appear
**Check:**
- Backend running and connected to database
- JWT token valid (try logout/login)
- Case has uploaded scene image
- Browser console for errors

### CORS Error
**Error:** `blocked by CORS policy`

**Solution:**
- Restart backend server
- Verify frontend URL in backend CORS config
- Check backend is allowing `http://localhost:5174`

For more issues, see: **TROUBLESHOOTING_CHECKLIST.md**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **README.md** | This file - project overview |
| **QUICK_START.md** | Fast setup and testing |
| **STARTUP_GUIDE.md** | Detailed step-by-step setup |
| **EVIDENCE_PIN_FEATURE.md** | Pin mapping technical docs |
| **IMPLEMENTATION_SUMMARY.md** | What was built and how |
| **TESTING_CHECKLIST.md** | Comprehensive test cases |
| **TROUBLESHOOTING_CHECKLIST.md** | Error solutions |

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Authorization checks on all routes
- ✅ User can only access own cases
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variable protection

---

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Change MongoDB whitelist to specific IPs
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Add request logging
- [ ] Configure CSP headers
- [ ] Enable CORS for production domain only
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB cluster

### Recommended Platforms
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend:** Railway, Render, Fly.io, AWS, Heroku
- **Database:** MongoDB Atlas (already cloud-hosted)

---

## 🎯 Future Enhancements

### Potential Features
1. **Drag-and-drop reposition** - Move pins after creation
2. **Pin connections** - Draw relationship lines between evidence
3. **Zoom & Pan** - Magnify scene photos
4. **Multi-photo support** - Different angles per case
5. **Photo annotations** - Draw shapes and arrows
6. **PDF export** - Generate evidence map reports
7. **Timeline integration** - Show evidence collection timeline
8. **3D positioning** - Add Z-coordinate for multi-level scenes
9. **Role-based access** - Supervisor, Officer, Analyst roles
10. **Real-time collaboration** - Multiple users on same case

---

## 📊 Current Status

✅ **Fully Implemented Features:**
- User authentication (signup/login)
- Case management (CRUD operations)
- Interactive pin mapping
- Evidence metadata tracking
- Percentage-based positioning
- Mobile responsive design
- Dark theme UI
- Real-time updates

🔄 **Ready for:**
- Production deployment (with security hardening)
- User testing and feedback
- Feature expansion
- Integration with other forensic tools

---

## 👥 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices
- Use Tailwind classes for styling
- Write self-documenting code
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built for law enforcement and forensic investigators
- Designed to streamline crime scene documentation
- Focused on field usability and accuracy
- Percentage-based positioning concept inspired by responsive web design principles

---

## 📞 Support

For issues, questions, or feature requests:
1. Check **TROUBLESHOOTING_CHECKLIST.md**
2. Review **EVIDENCE_PIN_FEATURE.md** for technical details
3. Open an issue on GitHub (if applicable)
4. Contact development team

---

## 🎊 Getting Started Now

```cmd
# 1. Clone or navigate to project
cd imageTracker

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Configure environment variables
# Edit backend/.env with your MongoDB URI

# 5. Start backend (Terminal 1)
cd backend
npm run dev

# 6. Start frontend (Terminal 2)
cd frontend
npm run dev

# 7. Open browser
http://localhost:5174

# 8. Create account and start mapping evidence!
```

---

**Version:** 1.0.0
**Last Updated:** June 13, 2026
**Status:** ✅ Production Ready (pending security hardening)

**Core Innovation:** Percentage-based pin positioning ensures evidence markers stay accurate across all devices and zoom levels, making this the perfect field tool for crime scene investigators.
