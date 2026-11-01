# EstatePro | Premium Real Estate Website & Lead Management CRM

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-darkgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

A full-stack, enterprise-grade real estate platform where clients explore curated luxury property listings and brokerage teams manage customer enquiries, sales pipelines, and follow-up activities through a centralized CRM.

---

## 🌟 Key Features

### 1. Public Real Estate Portal
- **Immersive Homepage**: Dynamic hero with live quick search, statistical credibility metrics, curated featured properties, value propositions, client testimonials, and consult CTA.
- **Advanced Catalog & Filters**:
  - Full-text search across titles, descriptions, addresses, and cities.
  - Multi-attribute filtering: Location (City), Budget Range (Min/Max Price), Property Type (`Villa`, `Penthouse`, `Apartment`, `Townhouse`, `Commercial`, `Studio`), Bedrooms, and Listing Status (`For Sale`, `For Rent`).
  - Sorting by Newest, Price (Low/High), Most Popular views, and Area (SqFt).
  - Responsive grid and pagination.
- **Comprehensive Property Detail Page**:
  - High-resolution interactive photo gallery with thumbnail selector.
  - Key specifications grid: Bedrooms, Bathrooms, Total SqFt, Parking, Year Built.
  - Rich amenities badge checklist.
  - **Interactive Mortgage & Financing Estimator**: Real-time monthly payment calculation based on down payment %, interest rate %, and loan term.
  - Assigned listing agent card with direct contact channels.
  - **Integrated Lead Capture**: Direct modal and inline "Schedule Private Tour" enquiry form with celebratory confetti feedback.

### 2. Centralized CRM & Lead Management
- **Automated Lead Ingestion**: Every enquiry submitted on the website is instantly captured as a lead with client name, email, phone, contact preference, timestamp, and target property snapshot.
- **Full Sales Pipeline Tracking**:
  - 6 pipeline stages: `New` ➔ `Contacted` ➔ `Interested` ➔ `Negotiation` ➔ `Converted` ➔ `Lost`.
  - One-click status transitions with automatic audit note logging.
- **Dual Visual Modes**:
  - **Interactive Table View**: Filter by status, priority, and source with search and quick actions.
  - **Kanban Pipeline Board**: Drag/move leads across visual pipeline stages.
- **Follow-up Management**:
  - Chronological interaction timeline for each lead.
  - Log calls, emails, site visits, meetings, and internal notes.
  - Next follow-up date scheduling and proactive dashboard reminders.
- **Manual Lead Creation**: Offline walk-in and phone lead entry modal for brokerage staff.

### 3. Executive Dashboard & Analytics
- **KPI Metrics**: Total Properties, Total Leads, Active Enquiries, Converted Leads, Conversion Rate (%), and Closed Sales Value.
- **Interactive Visualizations (Recharts)**:
  - **Pipeline Distribution**: Donut chart showing lead breakdown by status.
  - **Monthly Inflow & Conversions**: Dual-gradient area chart tracking leads and conversion trajectory.
  - **Inventory Density**: Bar chart visualizing listings across property classes.
- **Recent Activities Feed**: Latest inquiries with instant access to lead dossiers.
- **Follow-up Reminders**: Next scheduled client calls and property walkthroughs.

### 4. Property Catalog CMS
- Complete CRUD operations for listing management.
- Add new properties with specifications, amenities, and high-res imagery.
- Delete and modify properties (secured with role-based permissions).

### 5. Backend & Database Architecture
- **RESTful API**: Clean controller-service pattern built with Express.js.
- **Authentication & RBAC**: JWT bearer tokens, bcrypt password hashing, and role checks (`admin`, `agent`).
- **Data Validation & Sanitization**: Error handling middleware catching duplicates, cast errors, and validation constraints.
- **Database**: Mongoose schemas with indexed text search and aggregation pipelines for analytics.

---

## 🏗️ Architecture & Project Structure

```text
real-estate-website/
├── client/                      # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer
│   │   │   ├── website/         # HeroSection, PropertyCard, EnquiryModal
│   │   │   └── crm/             # CrmLayout, Lead modals & charts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # JWT authentication state
│   │   │   └── ToastContext.tsx # Global toast notification alerts
│   │   ├── pages/
│   │   │   ├── website/         # HomePage, ListingsPage, PropertyDetailPage
│   │   │   └── crm/             # CrmLoginPage, CrmDashboardPage, CrmLeadsPage, CrmPropertiesPage, CrmAnalyticsPage
│   │   ├── services/
│   │   │   └── api.ts           # Axios client with interceptors
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # React Router v6 setup
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                      # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Properties, Leads, Analytics
│   │   ├── middleware/          # JWT Protect, RBAC Authorize, ErrorHandler
│   │   ├── models/              # User, Property, Lead (Mongoose)
│   │   ├── routes/              # Express API routers
│   │   ├── seed/                # Comprehensive seed data script
│   │   └── server.js            # Express app bootstrap
│   ├── .env.example
│   ├── .env
│   └── package.json
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20+)
- **npm** or **yarn** / **pnpm**
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

---

### Step 1: Install Dependencies

From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### Step 2: Environment Configuration

Create `server/.env` (pre-configured template available in `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/real_estate_crm
JWT_SECRET=estate_pro_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

### Step 3: Seed Database with Realistic Demo Data

Populate 10 luxury properties, 8 leads across all sales pipeline stages, and staff user accounts:
```bash
cd server
npm run seed
```

**Pre-configured Staff Accounts:**
| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@estatepro.com` | `password123` |
| **Licensed Agent** | `sarah.jenkins@estatepro.com` | `password123` |

*(The CRM Login page also provides **1-Click Demo Login** buttons for instant access).*

---

### Step 4: Run the Application

Start both the backend server and frontend development client:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Now open **`http://localhost:5173`** in your browser!

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new agent/admin account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Get authenticated profile `[Protected]`

### Properties (`/api/properties`)
- `GET /api/properties` - List properties with filters (`search`, `city`, `propertyType`, `status`, `minPrice`, `maxPrice`, `bedrooms`, `sort`, `page`, `limit`)
- `GET /api/properties/featured` - Get featured listings for homepage
- `GET /api/properties/meta/cities` - Get available cities and price ranges
- `GET /api/properties/:id` - Single property detail (increments view count)
- `POST /api/properties` - Add listing `[Admin / Agent]`
- `PUT /api/properties/:id` - Update listing `[Admin / Agent]`
- `DELETE /api/properties/:id` - Remove listing `[Admin only]`

### Leads & Enquiries (`/api/leads`)
- `POST /api/leads` - Public website enquiry / schedule tour submission
- `GET /api/leads` - Filtered leads pipeline query `[Protected]`
- `GET /api/leads/:id` - Detailed lead file with interactions `[Protected]`
- `PUT /api/leads/:id/status` - Transition status (`New` ➔ `Converted`) `[Protected]`
- `POST /api/leads/:id/follow-ups` - Append follow-up activity/reminder `[Protected]`
- `PUT /api/leads/:id` - Modify lead information `[Protected]`
- `DELETE /api/leads/:id` - Delete lead record `[Admin only]`

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Executive KPI metrics, donut status data, and monthly trends `[Protected]`

---

## 🧪 Production Build

To verify build integrity and bundle static assets:
```bash
cd client
npm run build
```
Creates an optimized, minified production build inside `client/dist`.

