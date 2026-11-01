# EstatePro | Premium Real Estate Website & Lead Management CRM

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://estatepro-demo.vercel.app)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://estatepro-api.onrender.com/api/health)
[![React](https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_&_MongoDB-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, responsive, full-stack real estate platform and centralized customer relationship management (CRM) system. Built for property seekers to discover luxury residential and commercial properties, and for brokerage teams to capture customer inquiries, manage the lead sales pipeline, track follow-ups, and analyze performance metrics.

---

## 📌 Submission & Evaluation Overview

* **Repository:** Complete full-stack monorepo (`client/` and `server/`)
* **Live Web Portal:** [https://estatepro-demo.vercel.app](https://estatepro-demo.vercel.app) *(or your deployed Vercel link)*
* **Live API Endpoint:** [https://estatepro-api.onrender.com/api/health](https://estatepro-api.onrender.com/api/health) *(or your deployed Render link)*
* **Demo Video / Walkthrough:** [Watch 3-Minute Demo Video](https://loom.com) *(replace with your recording link)*

### 🔑 Demo Credentials (1-Click Login available on CRM login page)

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@estatepro.com` | `password123` | Full access: Manage inventory, delete records, view executive analytics, all leads |
| **Sales Agent** | `sarah.jenkins@estatepro.com` | `password123` | CRM access: Lead pipeline, follow-ups, tour scheduling, property management |

---

## 📋 Requirements Completion Matrix

| Requirement Area | Specification | Implementation Details | Status |
|---|---|---|:---:|
| **1. Real Estate Website** | Professional homepage with featured properties | Dynamic hero with search, KPI counters, curated featured carousel, client testimonials, and consultation CTA. | ✅ **Complete** |
| | Listings with images, prices, locations & specs | Responsive grid displaying high-res photography, prices, badges, beds, baths, sqft, and neighborhood tags. | ✅ **Complete** |
| | Search & multi-attribute filters | Real-time full-text search, Buy/Rent toggle, property type, price range slider, bedrooms, and sorting. | ✅ **Complete** |
| | Individual property detail pages | High-res photo gallery, full specs, amenities badges, interactive mortgage calculator, and agent card. | ✅ **Complete** |
| | Enquiry capture form | Modal and inline tour booking form with instant validation, lead ingestion, and celebratory visual feedback. | ✅ **Complete** |
| **2. CRM & Lead Management** | Capture enquiries from website | Automatically stores incoming inquiries with client details, contact preference, and property snapshot. | ✅ **Complete** |
| | Display lead details & enquiry date | Comprehensive lead dossiers with chronological timelines, timestamps, and contact channels. | ✅ **Complete** |
| | 6-Stage sales pipeline tracking | `New` ➔ `Contacted` ➔ `Interested` ➔ `Negotiation` ➔ `Converted` ➔ `Lost` with 1-click status transitions. | ✅ **Complete** |
| | Dual CRM views (Table & Kanban) | Interactive data table with status filtering, plus visual drag-and-move Kanban pipeline board. | ✅ **Complete** |
| | Follow-up management | Log calls, emails, site tours, and notes with scheduled next-action reminders and dashboard alerts. | ✅ **Complete** |
| **3. Dashboard & Analytics** | Key performance indicators (KPIs) | Total Properties, Total Leads, Active Enquiries, Converted Leads, Conversion Rate (%), and Pipeline Value. | ✅ **Complete** |
| | Visual charts (Recharts) | Donut chart for status breakdown, dual-gradient area chart for monthly inflow/conversions, and density bar chart. | ✅ **Complete** |
| | Recent activities & reminders | Real-time inquiry feed and upcoming client follow-up reminder list with urgency tags. | ✅ **Complete** |
| **4. Backend & Database** | Node.js + Express.js REST APIs | Modular controller-service architecture with complete CRUD operations for properties and leads. | ✅ **Complete** |
| | MongoDB with Mongoose | Relational schemas, text search indexing, and aggregation pipelines for analytics. | ✅ **Complete** |
| | Cloud Database (MongoDB Atlas) | Configured with automatic public DNS fallback for zero-latency cloud connectivity. | ✅ **Complete** |
| | Authentication & RBAC | JWT bearer tokens, bcrypt password hashing, and role-based route guards (`admin`, `agent`). | ✅ **Complete** |
| | Input validation & Error handling | Centralized Express error handler, MongoDB duplicate/cast error formatting, and input sanitization. | ✅ **Complete** |
| **5. Technical Execution** | React 18 + TypeScript + Vite | Clean component architecture, strict typing, custom hooks, and context state management. | ✅ **Complete** |
| | Responsive Design | Fully responsive across mobile (375px+), tablet (768px+), and high-resolution desktops (1440px+). | ✅ **Complete** |

---

## 🛠️ Technology Stack

```
Frontend:                 Backend:                  Database:               DevOps & Cloud:
├── React 18 (Vite)       ├── Node.js (v22)         ├── MongoDB 8.0         ├── Vercel (Frontend)
├── TypeScript 5.7        ├── Express.js 4.21       ├── MongoDB Atlas       ├── Render (Backend API)
├── Tailwind CSS 3.4      ├── Mongoose 8.9          ├── Mongoose Schemas    ├── Git & GitHub
├── Lucide React Icons    ├── JWT (jsonwebtoken)    └── Aggregation Engine  └── npm Workspaces
├── Recharts (Analytics)  ├── bcryptjs (Hashing)
└── Canvas Confetti       └── Morgan (Logging)
```

---

## 📁 Project Architecture & Directory Structure

```text
real-estate-website/
├── client/                               # Frontend Application (React 18 + TypeScript + Vite)
│   ├── public/                           # Static assets, logos, and favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                   # Global Navbar, Footer, Mobile Navigation
│   │   │   ├── website/                  # HeroSection, PropertyCard, EnquiryModal, MortgageCalculator
│   │   │   └── crm/                      # CrmLayout, LeadStatusModal, FollowUpModal, AnalyticsCharts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx           # Authentication state & JWT persistence
│   │   │   └── ToastContext.tsx          # Real-time toast notifications system
│   │   ├── pages/
│   │   │   ├── website/
│   │   │   │   ├── HomePage.tsx          # Landing page with hero, stats, featured listings & reviews
│   │   │   │   ├── ListingsPage.tsx      # Multi-attribute catalog with search & Buy/Rent sync
│   │   │   │   └── PropertyDetailPage.tsx# Gallery, specifications, amenities, calculator & inquiry
│   │   │   └── crm/
│   │   │       ├── CrmLoginPage.tsx      # Staff portal with 1-Click Demo Login
│   │   │       ├── CrmDashboardPage.tsx  # Executive overview, KPI cards, charts & reminder feeds
│   │   │       ├── CrmLeadsPage.tsx      # Dual-view CRM (Interactive Table & Kanban Pipeline)
│   │   │       ├── CrmPropertiesPage.tsx # Inventory management (CRUD operations)
│   │   │       └── CrmAnalyticsPage.tsx  # In-depth funnel charts and performance breakdowns
│   │   ├── services/
│   │   │   └── api.ts                    # Axios client with JWT interceptor & service methods
│   │   ├── types/
│   │   │   └── index.ts                  # Shared TypeScript interfaces (Property, Lead, User, KPI)
│   │   ├── App.tsx                       # React Router v6 routing table
│   │   └── main.tsx                      # Vite React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts                    # Vite config with proxy & network host binding
│
├── server/                               # Backend REST API (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection with DNS SRV fallback
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, Login, Current Profile
│   │   │   ├── propertyController.js     # Search, filter, CRUD, and view increment
│   │   │   ├── leadController.js         # Capture inquiries, status updates, follow-up logs
│   │   │   └── analyticsController.js    # Mongoose aggregation pipelines for KPI metrics
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT verification & role authorization (RBAC)
│   │   │   └── errorHandler.js           # Centralized API error handling & status codes
│   │   ├── models/
│   │   │   ├── User.js                   # Staff schema with bcrypt password hashing
│   │   │   ├── Property.js               # Listings schema with text indexes & amenities
│   │   │   └── Lead.js                   # Lead schema with stage enums & follow-up subdocuments
│   │   ├── routes/
│   │   │   ├── authRoutes.js             # /api/auth endpoints
│   │   │   ├── propertyRoutes.js         # /api/properties endpoints
│   │   │   ├── leadRoutes.js             # /api/leads endpoints
│   │   │   └── analyticsRoutes.js        # /api/analytics endpoints
│   │   ├── seed/
│   │   │   └── seedData.js               # Database population script (10 listings, 8 leads, 3 users)
│   │   └── server.js                     # Express bootstrap, CORS & route mounting
│   ├── .env.example                      # Environment variables template
│   ├── .env                              # Local environment configuration (gitignored)
│   └── package.json
│
├── .gitignore                            # Excludes node_modules, .env, build output, and DB files
├── package.json                          # Monorepo root scripts
└── README.md                             # Comprehensive project documentation
```

---

## ⚡ Quick Start Guide (Run Locally)

### 1. Prerequisites
* **Node.js** (v18.x or v20+ recommended)
* **npm** (v9+ or v10+)
* **MongoDB** (local service on `mongodb://127.0.0.1:27017` **OR** free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<your-username>/real-estate-website.git
cd real-estate-website

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### 3. Configure Environment Variables

#### Backend (`server/.env`):
Create a `.env` file in the `server` directory (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development

# Option A: MongoDB Atlas (Cloud - Recommended)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/real_estate_crm?retryWrites=true&w=majority

# Option B: Local MongoDB
# MONGODB_URI=mongodb://127.0.0.1:27017/real_estate_crm

JWT_SECRET=estate_pro_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env` - Optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```
*(If omitted, Vite defaults automatically to `http://localhost:5000/api`).*

---

### 4. Seed the Database
Populate your database with 10 luxury properties (4 For Rent, 6 For Sale), 8 CRM leads across all pipeline stages, and demo staff accounts:

```bash
cd server
npm run seed
```

Output:
```text
[Seed] Connected to MongoDB
[Seed] Cleared existing data
[Seed] Created users: admin@estatepro.com & agents
[Seed] Created 10 realistic properties
[Seed] Created 8 leads across sales pipeline
-------------------------------------------------------
 Database Seeded Successfully!
 Admin Credentials: admin@estatepro.com / password123
 Agent Credentials: sarah.jenkins@estatepro.com / password123
-------------------------------------------------------
```

---

### 5. Launch the Application

Run both the backend server and frontend client in separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# ➜ Express API active on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# ➜ Vite Client active on http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)** to explore the platform.

---

## 🎯 Key Application Features & Workflows

### 1. Property Discovery & Search Experience
* **Two-Way URL Synchronized Filters:** Clicking "Buy" or "Rent" in the top navigation immediately applies the filter, updates the URL (`/properties?status=For+Rent`), and highlights the active tab in real time.
* **Instant Multi-Filter Sidebar:** Filter simultaneously by location (city dropdown), listing status, price range slider, bedrooms, and property type (`Apartment`, `Villa`, `Townhouse`, `Penthouse`, `Commercial`, `Studio`).
* **Interactive Mortgage Calculator:** Located on each property detail page; computes monthly principal, interest, property taxes, and home insurance in real time based on user-adjustable down payment (%), interest rate (%), and loan tenure (years).

### 2. Automated Lead Capture & Follow-up Timeline
* **Zero-Friction Ingestion:** When a visitor submits an inquiry on any property or clicks "Schedule Private Tour", the system automatically creates a new lead in the CRM linked to that specific property.
* **Celebratory UI Feedback:** Inquiries trigger a micro-interaction with toast confirmation and celebratory canvas confetti.
* **Chronological Activity Log:** Agents can record client interactions (`Phone Call`, `Email`, `Site Visit`, `Meeting`, `Internal Note`) with automated timestamping and schedule the next follow-up date.

### 3. Centralized CRM Pipeline
* **Dual View Switching:**
  * **Table View:** Search by name/email/phone, filter by lead status, and view property snapshots.
  * **Kanban Board:** Visual cards grouped by sales stage (`New` ➔ `Contacted` ➔ `Interested` ➔ `Negotiation` ➔ `Converted` ➔ `Lost`).
* **Status Updates:** One-click modal allows updating lead status with mandatory note recording for audit trails.

### 4. Executive Analytics Dashboard
* **Dynamic KPI Cards:** Total active inventory, total captured leads, active enquiries, converted deals, conversion rate (%), and total pipeline revenue.
* **Visual Charts Powered by Recharts:**
  * **Pipeline Distribution Donut:** Visualizes percentage share of leads in each stage.
  * **Monthly Inflow & Conversion Area Chart:** Compares incoming leads vs. closed conversions over the last 6 months.
  * **Inventory Density Bar Chart:** Displays inventory distribution across property types.
* **Proactive Reminders Feed:** Highlights upcoming client callbacks and property tours requiring agent attention.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new staff member | Public |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (JWT) |

### Property Catalog (`/api/properties`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/properties` | Query listings with multi-filter & pagination | Public |
| `GET` | `/api/properties/featured`| Retrieve curated featured listings | Public |
| `GET` | `/api/properties/meta/cities` | List unique cities and price limits | Public |
| `GET` | `/api/properties/:id` | Get single property dossier (increments view count) | Public |
| `POST` | `/api/properties` | Create new property listing | Admin / Agent |
| `PUT` | `/api/properties/:id` | Update property specifications and photos | Admin / Agent |
| `DELETE` | `/api/properties/:id` | Delete listing from catalog | Admin only |

### Leads & Enquiries (`/api/leads`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/leads` | Capture enquiry from public website | Public |
| `GET` | `/api/leads` | Get leads with search & status filters | Private (JWT) |
| `GET` | `/api/leads/:id` | Get detailed lead dossier and activity timeline | Private (JWT) |
| `PUT` | `/api/leads/:id/status` | Update pipeline stage (`New` to `Converted`) | Private (JWT) |
| `POST` | `/api/leads/:id/follow-ups`| Log interaction (Call, Email, Tour, Note) | Private (JWT) |
| `PUT` | `/api/leads/:id` | Edit lead contact details & priority | Private (JWT) |
| `DELETE` | `/api/leads/:id` | Delete lead record | Admin only |

### Analytics & Reports (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard`| Aggregate KPI metrics, stage donut data, and trend curves | Private (JWT) |

---

## 🌐 Live Cloud Deployment Guide

### Step 1: Cloud Database (MongoDB Atlas)
1. Create a free shared cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, set IP Access to `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a user and copy the connection URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/real_estate_crm?retryWrites=true&w=majority
   ```
4. Run `npm run seed` in your local `server/` directory pointing to this URI to populate the cloud database with demo data.

### Step 2: Backend API on [Render.com](https://render.com)
1. Connect your GitHub repository and choose **New Web Service**.
2. Set configuration:
   * **Root Directory:** `server`
   * **Build Command:** `npm install`
   * **Start Command:** `node src/server.js`
3. Add Environment Variables:
   * `NODE_ENV` = `production`
   * `PORT` = `5000`
   * `MONGODB_URI` = *(your MongoDB Atlas URI)*
   * `JWT_SECRET` = `estate_pro_super_secret_jwt_key_2026`
4. Copy your live service URL: `https://estatepro-api.onrender.com`.

### Step 3: Frontend Client on [Vercel.com](https://vercel.com)
1. Import your GitHub repository into Vercel.
2. Set configuration:
   * **Framework Preset:** Vite
   * **Root Directory:** `client`
3. Add Environment Variable:
   * `VITE_API_URL` = `https://estatepro-api.onrender.com/api`
4. Click **Deploy**. Your live web application will be live at `https://estatepro-demo.vercel.app`!

---

## 🧪 Testing & Code Quality

* **Production TypeScript Build:**
  ```bash
  cd client
  npm run build
  ```
  Runs `tsc -b` type checking followed by Vite production bundling with zero errors.

* **API Health Check:**
  Navigate to `http://localhost:5000/api/health` to confirm server status and database connectivity:
  ```json
  {
    "status": "healthy",
    "message": "Real Estate Website & CRM API is running smoothly",
    "timestamp": "2026-11-01T21:30:00.000Z"
  }
  ```

---

## 📄 License
This project is developed as a technical evaluation assignment. All rights reserved.