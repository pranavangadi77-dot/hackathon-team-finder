# 🚀 HackMate – Hackathon Team Finder

> **"Your Next Big Idea Needs the Right Team."**
> A modern, full-stack platform that helps students discover complementary teammates for hackathons based on technical skills, project problem statements, and intelligent skill-gap analysis.

![HackMate Platform](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Highlights & Key Features

### 1. 🧠 Intelligent Skill-Gap Recommendation Engine
Our core matching algorithm identifies **missing skills** in open hackathon teams and ranks opportunities using a transparent weighted formula:
- **60% Required Skill & Skill Gap Coverage**: Prioritizes unfulfilled stack needs (e.g., if a team has React + Python but is missing Node.js + Machine Learning).
- **20% Track & Problem Interest Compatibility**: Matches hackathon categories (AI, Web3, FinTech, HealthTech, EdTech, etc.).
- **10% Experience Level Fit**: Aligns preferred hacker seniority (Beginner Friendly, Intermediate, Advanced).
- **10% Campus / Preference Affinity**: Synergizes campus peer networks and project track interests.
- **Explainable Matching**: Displays transparent AI explanations (`"Fills critical skill gaps: Machine Learning, Node.js"`) and score breakdowns.

### 2. ⚡ Complete Join Request & Team Roster System
- **Personalized Join Pitches**: Students send custom notes highlighting how their skills fulfill team vacancies.
- **Leader Review & Instant Roster Updates**: Team leaders accept or decline requests in 1 click; accepted applicants are automatically added to the team roster and vacancies decrement.
- **Capacity Enforcement & Duplicate Prevention**: Prevents duplicate pending requests and guards against teams exceeding maximum member limits.
- **Sent Requests Tracking**: Students track application statuses (`Pending`, `Accepted`, `Rejected`, `Cancelled`) with live status badges.

### 3. 🎯 Discover Teams & Find Members
- **Discover Teams**: Search and filter teams by technical skills, hackathon name, university, category, and open vacancies, with sorting by newest, approaching deadline, or most open spots.
- **Find Members Directory**: Team leads browse student profiles, inspect technical skills, hackathon history, GitHub/LinkedIn links, and send direct team invitations.
- **Create Team Opening**: Leaders publish project problem statements, specify required skills with dynamic tags, set member capacities (2-10), and designate application deadlines.

### 4. 🎨 Modern SaaS-Style UI/UX
- Designed with inspiration from Linear, Vercel, and modern dev tools.
- Dark navy/charcoal glassmorphism palette (`#07090E`), electric purple (`#8B5CF6`) and cyan accents.
- Responsive dashboard layout with sidebar navigation, profile completion progress meter, and real-time notification bell dropdown.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, REST API architecture, JWT Authentication, bcryptjs, Zod validation |
| **Database** | MongoDB, Mongoose ODM (with automatic fallback to in-memory store if local mongod is offline) |
| **Security** | Password hashing (bcrypt 10 rounds), JWT bearer tokens, Zod schema validation, CORS |

---

## 📁 Project Architecture

```
hackmate/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── TeamCard.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── JoinRequestModal.jsx
│   │   │   ├── TeamDetailsModal.jsx
│   │   │   ├── InviteMemberModal.jsx
│   │   │   ├── UserProfileModal.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # Global Auth Context (JWT + localStorage)
│   │   ├── layouts/            # Dashboard layout with Sidebar
│   │   ├── pages/              # Application views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DiscoverTeamsPage.jsx
│   │   │   ├── FindMembersPage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── CreateTeamPage.jsx
│   │   │   ├── MyTeamsPage.jsx
│   │   │   ├── JoinRequestsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/           # Axios API client with interceptors
│   │   ├── App.jsx
│   │   ├── index.css           # Tailwind + Glassmorphism styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express REST API Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── teamController.js
│   │   ├── requestController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect middleware
│   │   └── errorMiddleware.js  # Centralized error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── JoinRequest.js
│   │   ├── Notification.js
│   │   └── index.js            # Unified Mongoose & in-memory proxy
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── requestRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── recommendationService.js # Weighted skill-gap engine
│   │   └── inMemoryStore.js    # Resilient memory collection store
│   ├── validators/
│   │   ├── authValidator.js    # Zod registration & login schemas
│   │   └── teamValidator.js    # Zod team creation & join schemas
│   ├── seedData.js             # Realistic profiles & hackathon teams
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express application entrypoint
│   ├── .env.example
│   └── package.json
├── package.json                # Root package scripts
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ installed
- **npm** or **pnpm** installed
- Optional: MongoDB running locally or a MongoDB Atlas URI

### 2. Clone and Setup Environment
Navigate into the project directory:
```bash
cd "hackathon team finder"
```

Configure backend environment variables (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hackmate
JWT_SECRET=hackmate_super_secret_jwt_key_2026_production
JWT_EXPIRES_IN=30d
NODE_ENV=development
```
*(Note: If a local MongoDB daemon is not running, HackMate automatically activates its in-memory database fallback so you can test all features without setup friction).*

### 3. Seed Realistic Sample Data
Populate 12 realistic student profiles and 6 active hackathon teams:
```bash
cd server
npm run seed
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser!

---

## 🔑 Pre-Seeded Demo Accounts

Password for all pre-seeded student accounts: **`password123`**

*(You can also use the 1-Click Instant Demo Login buttons on the `/login` page)*

| Email | Name | Campus | Primary Specialty | Notable Role |
|---|---|---|---|---|
| `priya@hackmate.dev` | **Priya Patel** | MIT | Machine Learning, PyTorch, Python | Team Leader: *NeuroPulse Health* (HackMIT) |
| `liam@hackmate.dev` | **Liam O'Connor** | Trinity College Dublin | Node.js, Express, Redis, Docker | Backend Engineer (Perfect match for NeuroPulse) |
| `aarav@hackmate.dev` | **Aarav Sharma** | Stanford University | React, TypeScript, GraphQL | Fullstack Builder |
| `marcus@hackmate.dev` | **Marcus Chen** | UC Berkeley | Solidity, Web3.js, Rust | Team Leader: *ZeroCarbon Ledger* (ETHGlobal) |
| `elena@hackmate.dev` | **Elena Rostova** | Carnegie Mellon | Figma, UI/UX Design, Framer | Team Leader: *EduBridge Tutor* (HackColumbia) |
| `devon@hackmate.dev` | **Devon Vance** | Georgia Tech | Go, Kubernetes, AWS, Kafka | Team Leader: *AetherShield* (CalHacks) |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create student builder account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get logged-in user profile, completion %, and stats

### Students & Profiles
- `GET /api/users` - List all students (supports `q`, `skill`, `college`, `experience`)
- `GET /api/users/:id` - Get student profile details
- `PUT /api/users/profile` - Update technical skills, bio, links (Protected)
- `GET /api/users/search` - Autocomplete search

### Hackathon Teams
- `POST /api/teams` - Create & publish team opening (Protected)
- `GET /api/teams` - Discover teams (supports `q`, `skill`, `category`, `hackathonName`, `openPositionsOnly`, `sort`)
- `GET /api/teams/recommendations` - Run dynamic skill-gap matching engine (Protected)
- `GET /api/teams/:id` - Get full team and roster details
- `PUT /api/teams/:id` - Update team info (Leader only)
- `DELETE /api/teams/:id` - Delete team (Leader only)
- `POST /api/teams/:id/invite` - Invite student to team (Leader only)

### Join Requests
- `POST /api/requests` - Send join pitch to a team opening (Protected)
- `GET /api/requests/incoming` - Get requests for teams led by current user (Protected)
- `GET /api/requests/outgoing` - Get requests submitted by current student (Protected)
- `PATCH /api/requests/:id/accept` - Accept applicant & update roster (Leader only)
- `PATCH /api/requests/:id/reject` - Decline applicant (Leader only)
- `PATCH /api/requests/:id/cancel` - Cancel pending application (Student only)

### Notifications
- `GET /api/notifications` - Get student's notifications & unread count (Protected)
- `PATCH /api/notifications/:id/read` - Mark notification as read (Protected)
- `PATCH /api/notifications/read-all` - Mark all notifications as read (Protected)

---

## 🏆 Demonstrating HackMate to Hackathon Judges

1. **Visit Landing Page**: Showcase the animated skill-synergy preview, platform stats, and featured hackathon arenas.
2. **1-Click Login as Priya Patel (`priya@hackmate.dev`)**:
   - Inspect Priya's dashboard as a Team Leader of *NeuroPulse Health*.
   - Open **Join Requests**: See pending pitch from Liam O'Connor (`Node.js Backend specialist`).
   - Click **Accept to Team**: Watch the team roster update dynamically and available vacancies decrement.
3. **Switch to Liam O'Connor (`liam@hackmate.dev`)**:
   - Open **AI Matcher (`/recommendations`)**: See how the algorithm detects missing skills in teams and displays the transparent 4-tier score breakdown.
   - Click **Apply Now** on a recommended team and send a custom pitch.
4. **Discover & Filter Teams**:
   - Search by required skills (e.g. `Solidity` or `Machine Learning`), toggle "Open spots only", and sort by nearest deadline.
5. **Inspect Dynamic Profile Editing**:
   - Add/remove technical skills with tag pills and see profile completion percentage update in real time.

---

## 📄 License
MIT License. Built with passion for hackathon hackers worldwide.
