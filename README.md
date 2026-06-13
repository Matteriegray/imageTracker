# SceneMap

**Interactive crime scene evidence tracker for law enforcement**

Click on crime scene photos to place numbered evidence markers. Track evidence details, manage cases, and document investigations all in one place.

---

## Features

- **Click-to-Pin Mapping** - Mark evidence locations directly on scene photos
- **Case Management** - Create and organize investigations
- **Secure Authentication** - User accounts with JWT protection
- **Mobile Responsive** - Works on tablets and phones in the field
- **Dark Theme UI** - Professional interface optimized for law enforcement
- **Cloud Ready** - Deploy anywhere with MongoDB Atlas

---

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB Atlas account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd imageTracker
```

2. **Setup Backend**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Start Development**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

5. **Open Application**
- Visit: http://localhost:5174
- Create an account and start mapping evidence!

---

## How It Works

1. **Create Account** - Sign up with your name, email, and badge number
2. **Create Case** - Add case details and upload a crime scene photo
3. **Map Evidence** - Click on the photo to place numbered pins
4. **Add Details** - Fill in evidence information (item name, bag number, category, etc.)
5. **Track Progress** - View all evidence in the sidebar, click pins to see details

---

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express + MongoDB  
**Auth:** JWT + bcrypt

---

## Deployment

Live demo: [scenemap-frontend.onrender.com](https://scenemap-frontend.onrender.com)

Deploy your own:
- **Frontend:** Render, Vercel, Netlify
- **Backend:** Render, Railway, Fly.io
- **Database:** MongoDB Atlas

See [DEPLOY_QUICKSTART.md](DEPLOY_QUICKSTART.md) for detailed instructions.

---

## Security

- Password hashing with bcrypt
- JWT token authentication
- User data isolation
- CORS protection
- Environment variable configuration

---

## Screenshots

*Evidence pins on crime scene photo with numbered markers*  
*Case dashboard showing active investigations*  
*Mobile-responsive design for field use*

---

## Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## License

MIT License - See LICENSE file for details

---

## About

SceneMap streamlines crime scene documentation by allowing investigators to visually map evidence on photos. Percentage-based positioning ensures pins stay accurate across all devices and zoom levels.

**Built for law enforcement. Designed for the field.**
