# DataWill — Digital Estate Management

> Your digital life, on your terms.

DataWill is a full-stack web application for digital estate planning. Register your digital assets, write rules for what happens to them, designate trusted contacts, and let DataWill execute your wishes — automatically, cryptographically, and privately.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v6 |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Design** | Custom CSS design system (Instrument Serif + DM Sans) |
| **Security** | Helmet, Rate Limiting, Mongo Sanitize |

---

## 📁 Project Structure

```
DataWill/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI & layout components
│   │   │   ├── ui/           # Button, Badge, Input, Card, etc.
│   │   │   ├── layout/       # Sidebar, DashboardLayout, Navbar
│   │   │   └── auth/         # ProtectedRoute
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # All page components
│   │   │   ├── landing/      # Marketing landing page
│   │   │   ├── auth/         # Login & Register
│   │   │   ├── dashboard/    # Dashboard, Assets, Will, Contacts, Settings, Audit
│   │   │   └── beneficiary/  # Beneficiary portal
│   │   ├── services/         # API service modules
│   │   └── styles/           # Design system (variables, reset, typography, animations)
│   └── index.html
├── server/                   # Express backend
│   ├── config/               # Database connection
│   ├── controllers/          # Route handlers
│   ├── middleware/            # Auth, validation, error handler, audit logger
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── index.js              # Server entry point
└── package.json              # Root workspace scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) — *optional: falls back to in-memory MongoDB for dev*

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd DataWill

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Environment Variables

**`server/.env`**
```env
MONGO_URI=mongodb://localhost:27017/datawill
JWT_SECRET=your-secret-key-here
PORT=5000
SESSION_SECRET=your-session-secret
NODE_ENV=development
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Running

```bash
# Run both client + server concurrently
npm run dev

# Or separately:
npm run client    # Vite dev server (port 5173)
npm run server    # Express API (port 5000)
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Register new user |
| POST | `/api/auth/login` | ✗ | Login |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET/POST/PUT/DELETE | `/api/assets` | ✓ | Asset CRUD |
| GET/POST/PUT/DELETE | `/api/rules` | ✓ | Rule CRUD |
| GET/POST/PUT/DELETE | `/api/contacts` | ✓ | Contact CRUD |
| GET/POST | `/api/checkin` | ✓ | Check-in status & perform |
| GET/POST | `/api/death-report` | Mixed | Death verification |
| GET/POST | `/api/executions` | ✓ | Execution engine |
| GET | `/api/audit-log` | ✓ | Audit trail |
| GET/PUT | `/api/notifications` | ✓ | Notifications |
| GET/POST/PUT/DELETE | `/api/messages` | ✓ | Scheduled messages |
| GET/POST | `/api/will-versions` | ✓ | Will version history |

---

## 🎨 Design System

- **Colors**: Ink (dark), Mist (warm neutral), Sage (trust green), Gold, Slate, Rose
- **Typography**: Instrument Serif (emotion) + DM Sans (structure)
- **Motion**: No spinners — skeleton shimmer loading. Calm, unhurried animations.
- **Icons**: Phosphor Icons

---

## 📄 License

ISC
