# 🚀 HackathonTeam Finder

> **"Find Your Perfect Hackathon Team."**
> A modern, full-stack MERN platform that connects talented students, discovers complementary skills, and builds winning hackathon teams using an intelligent, deterministic skill-gap recommendation engine.

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-blue.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Test Suite](https://img.shields.io/badge/Automated%20Tests-21%2F21%20Passing-success.svg)]()

---

## 📋 Table of Contents
- [Problem Statement & Solution](#-problem-statement--solution)
- [Key Features](#-key-features)
- [Deterministic Recommendation Algorithm](#-deterministic-recommendation-algorithm)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Quick Start & Installation](#-quick-start--installation)
- [Pre-Seeded Demo Accounts & Teams](#-pre-seeded-demo-accounts--teams)
- [REST API Reference](#-rest-api-reference)
- [Automated Verification & Testing](#-automated-verification--testing)
- [College Evaluation & Live Demonstration Walkthrough](#-college-evaluation--live-demonstration-walkthrough)
- [Security & Validation](#-security--validation)
- [License](#-license)

---

## 🎯 Problem Statement & Solution

### The Problem
Hackathon participants frequently struggle to assemble well-rounded, balanced teams before strict registration deadlines. Students usually search within their immediate friend groups, resulting in teams saturated with duplicate skills (e.g., all frontend developers or all data scientists) while missing vital proficiencies such as backend engineering, database architecture, UI/UX design, or cloud deployment.

### The Solution: HackathonTeam Finder
**HackathonTeam Finder** provides a centralized, transparent platform where students can:
1. Showcase comprehensive builder profiles with technical and non-technical skills, preferred roles, past hackathons, and social portfolios.
2. Explore hackathons and discover teams actively looking for specific missing skills.
3. Form teams, designate member caps, and publish explicit missing skill gaps.
4. Leverage an **intelligent, deterministic recommendation engine** that matches student capabilities directly against the unfilled skill gaps of open teams.
5. Send join requests with personalized pitches, manage team rosters, and track applications with real-time notifications.

---

## 🌟 Key Features

### 1. 🧠 Smart Skill-Gap Recommendation System (Core Differentiator)
- Evaluates eligible teams dynamically against the student's skill profile.
- Uses a **deterministic weighted mathematical formula** (70% Skill Gap Match, 20% Preferred Role Match, 10% Availability Match).
- Transparent match breakdowns show students exactly which missing skills they fulfill and which skills the team still requires.
- Automatically excludes teams the student leads, belongs to, has already applied to, or that are closed/full.

### 2. 👥 Student Profiles & Builder Identity
- Comprehensive student profiles with academic details (College, Department, Year of Study).
- Rich skill tags across Technical (React, Python, Node.js, Machine Learning, MongoDB, etc.) and Non-Technical (UI/UX Design, Pitching, Project Management, Leadership) domains.
- Custom skill input support and experience level badges (`Beginner`, `Intermediate`, `Advanced`).
- External profile integrations for GitHub, LinkedIn, and personal portfolios.

### 3. 🛡️ Team Formation & Missing Skill Specification
- Leaders publish team openings with Hackathon details, event dates, registration deadlines, and maximum capacities (2–10 members).
- Specify existing required skills as well as explicit **Missing Skills** and **Available Roles** (e.g., *Backend Developer*, *ML Engineer*).
- Capacity management: Teams automatically update available vacancies when members join; full teams close applications automatically.

### 4. 📬 Join Request & Roster Management Workflow
- Applicants submit join requests with customized motivation pitches explaining how their skill set complements the team.
- Team leaders review applicant profiles, view their skills, and accept or reject requests in 1 click.
- Upon acceptance:
  - The applicant is automatically appended to the team roster.
  - Team vacancy decrements.
  - An automated notification is dispatched to the applicant.
- Duplicate applications and applications to full or closed teams are prevented.

### 5. 🔔 Notification System & Activity Feeds
- Real-time in-app notifications for join requests, leader acceptances, and status changes.
- Quick mark-as-read and mark-all-read actions.
- Visual badges in the top navigation bar.

---

## 📐 Deterministic Recommendation Algorithm

The recommendation engine implements a strict mathematical scoring function to rank open hackathon teams for any given student:

$$\mathbf{Final\ Match\ Score} = (\text{Skill Match} \times 0.70) + (\text{Preferred Role Match} \times 0.20) + (\text{Availability Match} \times 0.10)$$

### Component Breakdown
1. **Skill Match Score ($0 - 100\%$, Weight: $0.70$):**
   - Compares the student's combined skills (technical + non-technical) against the team's `missingSkills` array using case-insensitive normalization.
   - Formula:
     $$\text{Skill Match} = \frac{|\text{Student Skills} \cap \text{Team Missing Skills}|}{|\text{Team Missing Skills}|} \times 100$$
   - If a team has no missing skills specified, it evaluates against `requiredSkills`.
2. **Preferred Role Match Score ($0 - 100\%$, Weight: $0.20$):**
   - Checks if any of the student's `preferredRoles` match the team's `availableRoles`.
   - Returns $100\%$ if a match exists, otherwise $0\%$.
3. **Availability Match Score ($0 - 100\%$, Weight: $0.10$):**
   - Awarded $100\%$ if the student is marked as `"available"` or `"actively looking"`.
   - Awarded $50\%$ if marked as `"busy"` / `"limited"`.
   - Awarded $0\%$ if marked as `"unavailable"`.

### Eligibility & Exclusion Rules
Teams are automatically filtered out if:
- The team status is `closed`, `full`, or `archived`.
- There are no remaining vacancies (`availablePositions <= 0` or `members.length >= maxMembers`).
- The student is the creator/leader of the team.
- The student is already an accepted member of the team.
- The student has an active `pending` join request for the team.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 (Vite) | Fast, responsive Single Page Application |
| **Styling** | Tailwind CSS | Modern SaaS styling, subtle shadows, responsive cards |
| **Icons** | Lucide React | Clean, modern iconography |
| **Notifications** | React Hot Toast | Real-time user feedback and toast alerts |
| **Routing** | React Router DOM v6 | Protected client-side routing & route guards |
| **HTTP Client** | Axios | REST API communication with JWT interceptors |
| **Backend** | Node.js & Express.js | Modular RESTful API architecture |
| **Database** | MongoDB & Mongoose ODM | Document persistence with schema validation |
| **In-Memory Store**| Custom Resilient Memory Store | Seamless fallback ensuring zero setup friction |
| **Authentication** | JWT (JSON Web Tokens) & bcryptjs | Stateless authorization and secure password hashing |
| **Validation** | Zod Schema Validation | Strict request body validation & error formatting |

---

## 📁 Project Architecture & Directory Structure

```
hackathon team finder/
├── client/                              # Frontend React + Vite Application
│   ├── src/
│   │   ├── components/                  # Reusable UI Components
│   │   │   ├── Navbar.jsx               # Brand navigation & quick links
│   │   │   ├── Sidebar.jsx              # App navigation sidebar
│   │   │   ├── Footer.jsx               # Site footer with platform metadata
│   │   │   ├── TeamCard.jsx             # Team listing card with missing skills
│   │   │   ├── MemberCard.jsx           # Student profile card
│   │   │   ├── RecommendationCard.jsx   # Match badge, missing skill breakdown
│   │   │   ├── JoinRequestModal.jsx     # Join pitch submission modal
│   │   │   ├── TeamDetailsModal.jsx     # Comprehensive team overview modal
│   │   │   ├── NotificationDropdown.jsx # Real-time notification drawer
│   │   │   └── ProtectedRoute.jsx       # Auth guard wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # JWT token storage & session state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx      # Dashboard layout wrapper with sidebar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          # Hero, features, stats, demonstration preview
│   │   │   ├── LoginPage.jsx            # Authentication + 1-Click Demo Logins
│   │   │   ├── RegisterPage.jsx         # Full registration with academic fields
│   │   │   ├── DashboardPage.jsx        # Metrics, profile progress, quick actions
│   │   │   ├── DiscoverTeamsPage.jsx    # Search, filters, missing skill badges
│   │   │   ├── RecommendationsPage.jsx  # Smart Matcher with transparent scores
│   │   │   ├── CreateTeamPage.jsx       # Team builder with missing skill tags
│   │   │   ├── MyTeamsPage.jsx          # Teams I Lead vs Teams I Joined
│   │   │   ├── JoinRequestsPage.jsx     # Inbound pitches & outgoing applications
│   │   │   ├── FindMembersPage.jsx      # Student builder discovery
│   │   │   └── ProfilePage.jsx          # Builder profile editor & skill tags
│   │   ├── services/
│   │   │   └── api.js                   # Axios client with interceptors
│   │   ├── App.jsx                      # Router & Route declarations
│   │   ├── index.css                    # Tailwind CSS directives
│   │   └── main.jsx                     # Application root
│   ├── index.html                       # HTML5 entrypoint
│   ├── tailwind.config.js               # Tailwind custom color tokens
│   ├── vite.config.js                   # Vite configuration & proxy
│   └── package.json
│
├── server/                              # Backend Express Application
│   ├── config/
│   │   └── db.js                        # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js            # Registration, login, session, logout
│   │   ├── userController.js            # Profiles, skills, builder search
│   │   ├── teamController.js            # Team CRUD, missing skills, leave team
│   │   ├── requestController.js         # Join pitches, leader accept/reject
│   │   ├── recommendationController.js # Recommendations endpoint
│   │   └── notificationController.js   # Notification reads & listing
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT verification & req.user attachment
│   │   └── errorMiddleware.js           # Centralized exception handler
│   ├── models/
│   │   ├── User.js                      # Student model with skills & bio
│   │   ├── Team.js                      # Team model with missingSkills & roles
│   │   ├── JoinRequest.js               # Join pitch model with statuses
│   │   ├── Notification.js              # In-app notifications
│   │   └── index.js                     # Unified Mongoose & in-memory proxy
│   ├── routes/
│   │   ├── authRoutes.js                # /api/auth endpoints
│   │   ├── userRoutes.js                # /api/users endpoints
│   │   ├── teamRoutes.js                # /api/teams endpoints
│   │   ├── requestRoutes.js             # /api/requests endpoints
│   │   ├── recommendationRoutes.js      # /api/recommendations endpoint
│   │   └── notificationRoutes.js        # /api/notifications endpoints
│   ├── services/
│   │   ├── recommendationService.js     # Exact deterministic 70/20/10 engine
│   │   └── inMemoryStore.js             # Embedded fallback persistence store
│   ├── validators/
│   │   ├── authValidator.js             # Zod auth validation schemas
│   │   └── teamValidator.js             # Zod team creation & request schemas
│   ├── seedData.js                      # 15 Students & 8 Standard Hackathon Teams
│   ├── seed.js                          # Standalone seeding script
│   ├── testInProcess.js                 # 21-point automated test suite
│   ├── testApi.js                       # Test runner entrypoint
│   ├── server.js                        # Server entrypoint
│   ├── .env.example                     # Backend environment template
│   └── package.json
│
├── package.json                         # Monorepo root scripts
├── .gitignore
└── README.md                            # Comprehensive documentation
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ installed
- **npm** installed
- *(Optional)* A local MongoDB instance or MongoDB Atlas URI (if not present, the app automatically runs on its resilient in-memory database).

### 2. Environment Configuration
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hackathon_team_finder
JWT_SECRET=hackathon_team_finder_secure_jwt_secret_2026_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Seed Data
From the root project directory:
```bash
# Seed the 15 students and 8 hackathon teams
npm run seed
```

### 4. Run the Development Servers
From the root directory, start both frontend and backend concurrently:
```bash
npm run dev
```

Or run them individually in separate terminal windows:
```bash
# Terminal 1 - Backend Server (Port 5000)
npm run server

# Terminal 2 - Frontend Client (Port 5173)
npm run client
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Pre-Seeded Demo Accounts & Teams

All 15 pre-seeded student accounts use the default password: **`password123`**
*(The `/login` page also includes convenient **1-Click Instant Demo Login** buttons for Priya, Liam, Aarav, and Sofia).*

### The 15 Pre-Seeded Students
| Student Name | Email | College | Department & Year | Technical Skills |
|---|---|---|---|---|
| **Priya Patel** | `priya@hackmate.dev` | MIT | CS, 4th Year | Python, Machine Learning, Deep Learning, AI |
| **Liam O'Connor** | `liam@hackmate.dev` | Trinity College | CS, 3rd Year | Node.js, Express.js, MongoDB, Backend Dev |
| **Aarav Sharma** | `aarav@hackmate.dev` | Stanford | CS, 3rd Year | React, JavaScript, HTML, CSS, UI Development |
| **Sofia Rodriguez** | `sofia@hackmate.dev` | UC Berkeley | Design, 4th Year | UI/UX Design, Figma, Research, Frontend |
| **Marcus Chen** | `marcus@hackmate.dev` | UC Berkeley | EECS, 4th Year | Flutter, Android Development, Python |
| **Elena Rostova** | `elena@hackmate.dev` | Carnegie Mellon | HCI, Grad | Machine Learning, Python, Data Science |
| **Devon Vance** | `devon@hackmate.dev` | Georgia Tech | CyberSec, 3rd Year | Cybersecurity, Cloud Computing, Linux |
| **Ananya Iyer** | `ananya@hackmate.dev` | IIT Bombay | CS, 3rd Year | Node.js, MongoDB, SQL, Backend Dev |
| **Lucas Silva** | `lucas@hackmate.dev` | Univ. of Toronto | Data Science, 3rd Year | Computer Vision, Deep Learning, Python |
| **Zara Khan** | `zara@hackmate.dev` | Oxford | Software Eng, 2nd Year | React, TypeScript, Next.js, Tailwind |
| **Kavita Rao** | `kavita@hackmate.dev` | BITS Pilani | EE, 4th Year | IoT, Embedded Systems, C++, Python |
| **James Wilson** | `james@hackmate.dev` | Cambridge | CS, 3rd Year | Cloud Computing, AWS, Docker, Kubernetes |
| **Mei Lin** | `meilin@hackmate.dev` | NUS Singapore | Business Analytics, 3rd Year | Product Management, Presentation, UI/UX |
| **Tariq Al-Mansoor**| `tariq@hackmate.dev` | Waterloo | Software Eng, 4th Year | Database Development, PostgreSQL, Redis |
| **Chloe Dubois** | `chloe@hackmate.dev` | ETH Zurich | Robotics, Grad | Computer Vision, Robotics, C++, ROS |

### The 8 Pre-Seeded Hackathon Teams
| Team Name | Hackathon | Team Leader | Missing Skills (To Be Filled) | Vacancies |
|---|---|---|---|---|
| **AI Innovators** | National Innovation Challenge | Priya Patel | `Python`, `Backend Development` | 2 |
| **Web Wizards** | Global Hackfest 2026 | Aarav Sharma | `React`, `MongoDB` | 2 |
| **Quantum Coders**| Smart India Hackathon | Elena Rostova | `Python`, `Data Science` | 1 |
| **HealthTech Squad** | HealthTech Global Challenge | Sofia Rodriguez | `Machine Learning`, `UI/UX Design` | 2 |
| **GreenTech Builders**| CleanTech Summit Hackathon | Marcus Chen | `IoT`, `Flutter` | 2 |
| **Cyber Defenders** | CyberShield National Hackathon| Devon Vance | `Cybersecurity`, `Cloud Computing`| 1 |
| **FinTech Pioneers**| FinTech Future Hackathon | Ananya Iyer | `Node.js`, `Database Development` | 2 |
| **Vision Developers**| AI World Cup 2026 | Lucas Silva | `Computer Vision`, `React` | 1 |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student builder account | No |
| `POST` | `/api/auth/login` | Authenticate student & return JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in student profile & stats | Yes (Bearer Token) |
| `POST` | `/api/auth/logout` | Invalidate client session | No |

### Student Profiles (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users` | List all student profiles with search & filter | No |
| `GET` | `/api/users/me` | Fetch authenticated user's profile | Yes |
| `GET` | `/api/users/:id` | Fetch specific student profile by ID | No |
| `PUT` | `/api/users/profile` | Update profile, technical & non-technical skills | Yes |

### Hackathon Teams (`/api/teams`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/teams` | Browse all published teams (search, filters, sort) | No |
| `POST` | `/api/teams` | Create a team with missing skills & capacities | Yes |
| `GET` | `/api/teams/my-teams` | Get teams user leads and teams user has joined | Yes |
| `GET` | `/api/teams/:id` | Get comprehensive team info & roster | No |
| `PUT` | `/api/teams/:id` | Update team details (Leader only) | Yes |
| `DELETE` | `/api/teams/:id` | Delete team (Leader only) | Yes |
| `POST` | `/api/teams/:id/leave` | Leave a team (Members only; Leader cannot leave)| Yes |

### Smart Recommendations (`/api/recommendations` & `/api/teams/recommendations`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/recommendations` | Calculate deterministic match scores for user | Yes |
| `GET` | `/api/teams/recommendations` | Alias endpoint for recommendations | Yes |

### Join Requests (`/api/requests`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/requests` | Submit join request with personalized pitch | Yes |
| `GET` | `/api/requests/incoming` | Inbound requests for teams the user leads | Yes |
| `GET` | `/api/requests/outgoing` | Outbound requests submitted by the user | Yes |
| `GET` | `/api/requests/team/:teamId` | Inbound requests for a specific team | Yes |
| `PATCH`| `/api/requests/:id/accept` | Accept applicant & update roster (Leader only) | Yes |
| `PATCH`| `/api/requests/:id/reject` | Reject join application (Leader only) | Yes |
| `PATCH`| `/api/requests/:id/cancel` | Cancel pending join application (Applicant only)| Yes |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notifications` | Fetch student notifications & unread count | Yes |
| `PATCH`| `/api/notifications/:id/read` | Mark individual notification as read | Yes |
| `PATCH`| `/api/notifications/read-all`| Mark all notifications as read | Yes |

---

## 🧪 Automated Verification & Testing

The project includes an in-process end-to-end integration test suite verifying **21 core application workflows**:

```bash
# Run the test suite
npm test
# Or directly via node
node server/testApi.js
```

### What the 21 Tests Verify:
1. `POST /api/auth/register` - Successful registration of new student.
2. `POST /api/auth/register` - Rejection of duplicate email addresses.
3. `POST /api/auth/login` - Successful authentication and JWT generation.
4. `POST /api/auth/login` - Rejection of invalid credentials.
5. `GET /api/auth/me` - Authenticated profile fetch with correct payload.
6. `PUT /api/users/profile` - Profile updates with new technical/non-technical skills.
7. `GET /api/users` - Directory listing with skills filtering.
8. `GET /api/users/:id` - Fetching single profile by identifier.
9. `POST /api/teams` - Team creation, setting creator as leader and first member.
10. `GET /api/teams` - Team discovery with text search and status filter.
11. `GET /api/teams/:id` - Detailed team modal information lookup.
12. `GET /api/recommendations` - **Deterministic Recommendation verification (100% score for exact match)**.
13. `POST /api/requests` - Join request dispatch with applicant pitch.
14. `POST /api/requests` - Duplicate join request prevention.
15. `GET /api/requests/outgoing` - Retrieving user's submitted requests.
16. `GET /api/requests/incoming` - Leader retrieving inbound candidate pitches.
17. `PATCH /api/requests/:id/accept` - Leader accepting request; team roster updates and vacancy decrements.
18. `GET /api/notifications` - Automated notification arrival for accepted applicant.
19. `PATCH /api/notifications/read-all` - Notification dismissal.
20. `POST /api/teams/:id/leave` - Preventing team leader from abandoning leadership without assigning replacement.
21. `DELETE /api/teams/:id` - Secure deletion of team by authorized leader.

**Result: 21 Passed, 0 Failed.**

---

## 🎓 College Evaluation & Live Demonstration Walkthrough

Follow these steps for a live demonstration or presentation:

### Step 1: Landing Page & Problem Presentation
- Open `http://localhost:5173`.
- Highlight the hero section: *"Find Your Perfect Hackathon Team."*
- Review the **How It Works** and **Core Features** sections showing the complementary team formation process.
- Show the **Demonstration Metrics** showcasing active hackers and hackathons.

### Step 2: Test the Smart Recommendation Engine
- Click **Login** and use the **1-Click Demo Login** for **Liam O'Connor** (`liam@hackmate.dev`).
- Liam's primary skills are `Node.js`, `Express.js`, `MongoDB`, and `Backend Development`.
- Navigate to **Smart Matcher** (`/recommendations`).
- Notice the **AI Innovators** team is ranked at the very top:
  - Missing skills: `Python`, `Backend Development`.
  - Liam provides: `Backend Development`.
  - Transparent match explanation: explains the 70% Skill + 20% Role + 10% Availability calculation.
- Click **Apply Now** on a recommended team and submit a customized join pitch.

### Step 3: Team Leader Workflow (Accept Applicant & Decrement Vacancy)
- Logout and use the 1-Click Demo Login as **Priya Patel** (`priya@hackmate.dev`), the leader of *AI Innovators*.
- Notice the notification badge in the navbar and the **Pending Requests** metric on the dashboard.
- Navigate to **Join Requests** (`/requests`).
- Inspect incoming requests: View the applicant's profile, matched skills, and note.
- Click **Accept**.
- Navigate to **My Teams** (`/my-teams`):
  - Notice the new member has been added to the team roster.
  - Notice the team's available vacancies decreased.

### Step 4: Explore Teams with Advanced Filters
- Navigate to **Explore Teams** (`/teams`).
- Test real-time search: type `"Python"`, `"React"`, or `"CleanTech"`.
- Filter by status (`Open` vs `Full`), college, and minimum vacancies.
- Click **View Details** on any team card to open the modal showing leader bio, current roster, and missing skills.

### Step 5: Profile Customization & Dynamic Score Recalculation
- Navigate to **My Profile** (`/profile`).
- Select new skill badges from the interactive skill selector (e.g., add `Cybersecurity` or `UI/UX Design`).
- Click **Save Changes**.
- Return to **Smart Matcher** (`/recommendations`) and click **Recalculate Recommendations**:
  - Notice that teams requiring your newly added skills now rank higher!

---

## 🔒 Security & Validation

- **Password Encryption:** Passwords are cryptographically hashed using `bcryptjs` with 10 salt rounds. Plain-text passwords are never stored.
- **Stateless Authentication:** Secure JWT tokens signed with a secret key and transmitted via the `Authorization: Bearer <token>` header.
- **Input Validation:** All endpoints are protected by `Zod` schemas validating email format, password length (minimum 6 characters), capacity bounds, and skill arrays.
- **Authorization Guards:**
  - Non-leaders cannot modify, accept requests for, or delete teams they do not lead.
  - Team leaders cannot leave their own teams without transferring ownership or deleting the team.
  - Users cannot send duplicate requests or apply to teams they already belong to.

---

## 📄 License

This project is licensed under the MIT License. Built with passion for hackathon organizers and student developers worldwide.
