# Pulse360 — Advanced Telehealth & Clinic Management Platform
Pulse360 Banner

Pulse360 is a production-grade, full-stack digital health platform designed to facilitate patient-doctor video consultations, clinic slot bookings, medical history logging, and administrative settlements. Built with React 19, Node.js (Express v5), MongoDB, and Redis, the platform utilizes advanced modern web features such as browser-side AI media processing, secure socket gateways, background task queues, and interactive data visualization.

---

## 🌟 Key Application Features

### 👤 Role-Based Portals

#### 🛍️ Patient Storefront & Portal
*   **Search & Specialist Discovery**: Match and filter practitioners by clinical department, specialization, location, ratings, and consult fees.
*   **Slide-Over Profile Preview**: Slide-out profile drawer that renders full doctor biographies, verified certifications, experience timelines, credentials, and consult rates directly inside the checkout screen.
*   **Interactive Scheduling Checkout**: Step-by-step appointment scheduling featuring online/offline consult selections, slot locks, and checkout billing invoices.
*   **Integrated Digital Wallet**: Reusable balance wallet allowing instant bookings, Razorpay-based top-ups, and automated transaction logs.
*   **Consultation Hub**:
    *   **P2P Instant Messaging**: Private chat panels with message histories, typing indicators, and unread counts powered by **Socket.io**.
    *   **WebRTC Video Calls**: Direct peer-to-peer virtual video consultation rooms.
    *   **Selfie Segmentation**: Machine-learning background blur filter using **Google MediaPipe** to ensure patient privacy.
*   **Financial Tracking**: Visual charts showing medical expenditures across Day, Week, Month, and YTD scopes.

#### 🩺 Doctor Workspace Console
*   **Consultation Slot Editor**: Set weekly working hour blocks, modify fees, and manage online/offline bookings.
*   **Clinical Records Log (EHR)**: Create patient record folders, edit prescription logs, and track consultation history notes.
*   **Earnings Analytics**: Financial performance charts showing earnings, commission shares, and completed settlements.
*   **Payout Withdrawals**: Direct transfer logs and withdrawal requests for earned funds.

#### 🛡️ Administrative Console
*   **Executive Dashboard**: Real-time KPI trackers showing total active consults, commission percentages, and platform-wide transaction summaries.
*   **Doctor Verification Pipeline**: Pending applicant review system to inspect submitted council licenses and approve active doctor status.
*   **Account CRM**: Searchable directory of patient and doctor records, featuring account block/unblock logs and status controllers.

---

## 🔄 Core Architectural Workflows

### 1. Clerk Authentication & User Synchronization
*   Sign-in and session security are delegated to **Clerk Auth**.
*   When users complete registrations, Clerk triggers secure Webhook events to backend routers.
*   The backend validates webhooks using **Svix** and creates corresponding MongoDB records in the `users`, `patients`, and `doctors` collections.

### 2. Time-locked Scheduling Checkout
1.  **Booking**: Patient selects a slot, sending a reservation request to the backend.
2.  **Locking**: The slot is temporarily locked in the `Availability` database collection.
3.  **Payment**: Patient completes payment via Razorpay or the Digital Wallet.
4.  **Automatic Sweeper**: If the checkout remains unpaid, a background **Node-Cron** task sweeps and unlocks expired slots after 15 minutes.

### 3. completed Consultation Settlement
1.  **Completion**: The consultation status shifts to `completed` upon ending a video call or clinic visit.
2.  **Calculation**: The backend calculates the doctor's payout share and the administrator's platform commission percentage.
3.  **Transfer**: The system moves the doctor's share to their digital wallet and creates corresponding transaction records in the ledger.

### 4. Background Blur Canvas Pipeline
```text
[Local Webcam Video Track] 
       │
       ▼
[MediaPipe Selfie Segmentation] ──► Identifies Silhouette
       │
       ▼
[HTML5 Canvas Overlay] ──────────► Blurs Background Pixels
       │
       ▼
[Processed Canvas Stream] ───────► Transmitted via WebRTC to Doctor
```

---

## 🛠️ Complete Technical Stack & Library Ecosystem

### 💻 Frontend (Client Application)
*   **Core Libraries**: **React 19**, **Vite** (Next-gen HMR bundler), **React Router v7**.
*   **Design & Layout**: **Tailwind CSS v4** (utilizing `@tailwindcss/vite` compiling pipeline).
*   **Animations**: **Framer Motion**, **GSAP**, and **Popmotion** for micro-interactions and smooth drawers.
*   **Data Flow**: **Axios** clients, custom hooks, and React Context (User and Chat contexts).
*   **Real-time Communication**: **Socket.io-client** (for chat messages and video signals).
*   **3D Graphics**: **Three.js**, **React Three Fiber (R3F)**, and **Drei** (heartbeat loaders and landing page backgrounds).
*   **AI Media Processing**: **@mediapipe/selfie_segmentation** for virtual background filters.
*   **Interface Primitives**: **Radix UI** primitives and **lucide-react** / **@iconify/react** icons.
*   **Data Visualizations**: **Recharts** (earnings and expense timelines).
*   **Utilities**: **date-fns** (date manipulation) and **react-day-picker** (calendar selection).

### ⚙️ Backend (Server Application)
*   **Core Engine**: **Node.js** (ES Modules), **Express.js v5**.
*   **Database ORM**: **MongoDB**, **Mongoose ODM**.
*   **Task Workers**: **BullMQ** backed by **Redis** (ioredis client) for background email and invoice task dispatches.
*   **Cryptography**: **bcryptjs** (password hashing) and **jsonwebtoken (JWT)** (token verifications).
*   **File Management**: **Multer** and **Cloudinary SDK** for secure document uploads.
*   **Automated Scheduling**: **Node-Cron** for slot expirations and summary compilations.
*   **Mailing alerts**: **Nodemailer** for appointment alerts and email notifications.
*   **Document Generators**: **Puppeteer** (PDF invoice/medical record compilation) and **streamifier**.

---

## 🗄️ Database Schema Directory (Mongoose ODM)

| Schema Model | File | Description |
| :--- | :--- | :--- |
| **Admin** | `admin.model.js` | Platform settings, commission cuts, and parameters. |
| **Alert** | `alert.model.js` | Configuration logs for system alerts. |
| **Appointment** | `appointments.model.js` | Consultations records, date, timeslots, and statuses. |
| **Availability** | `availability.model.js` | Doctor calendar configurations and locked timeslot arrays. |
| **Consultation** | `consultation.model.js` | Video room logs, durations, and connection logs. |
| **Conversation** | `conversation.model.js` | Message threads and participant IDs. |
| **Doctor** | `doctor.model.js` | Onboarding profile, verified qualifications, and licenses. |
| **Escalation** | `escalation.model.js` | User complaints and dispute history records. |
| **Export** | `export.model.js` | History logs of compiled CSV/PDF reports. |
| **Message** | `message.model.js` | Text content, sender, timestamp, and read markers. |
| **Notification** | `notification.model.js` | In-app alerts and notifications records. |
| **Patient** | `patient.model.js` | Patient demographics, profiles, and onboarding records. |
| **PatientRecord** | `patientRecord.model.js`| Clinical records folders, diagnostics, and checkups history. |
| **Payment** | `payments.model.js` | Razorpay transactions, transaction IDs, and settlement flags. |
| **Prescription** | `prescription.model.js` | Medical advice and prescription lists. |
| **Review** | `review.model.js` | Star reviews and textual feedback logs. |
| **Settlement** | `settlement.model.js` | Doctor payout payouts, system commission splits, and statuses. |
| **SupportTicket** | `supportTicket.model.js`| Customer support tickets and resolution logs. |
| **Transaction** | `transaction.model.js` | Wallet ledgers recording deposits and checkouts. |
| **Wallet** | `wallet.model.js` | Current balance accounts for patients. |
| **WalletOrder** | `walletOrder.model.js` | Top-up orders created using Razorpay. |
| **Withdrawal** | `withdrawal.model.js` | Doctor payout requests and statuses. |

---

## 🔑 Environment Configuration

To run Pulse360, create `.env` files in both the `backend` and `frontend` folders.

### 🛡️ Backend (`backend/.env`)
```ini
PORT=5000
DB_URL=mongodb://localhost:27017/pulse-db

# JWT Token Security
JWT_SECRET=your_jwt_secret

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Razorpay Integration
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Cloudinary Assets
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# SMTP Email Server
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### 💻 Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 🚀 Local Development Quickstart

### Prerequisites
*   **Node.js**: Version 18.x or higher.
*   **MongoDB**: Run a local instance on port `27017`.
*   **Redis**: Run a local service on port `6379` (required for BullMQ queue operations).

### Installation Steps
1.  **Clone the project**:
    ```bash
    git clone https://github.com/yourusername/project-pulse.git
    cd project-pulse
    ```
2.  **Start Redis Server**:
    Ensure Redis is running:
    ```bash
    redis-server
    ```
3.  **Launch Backend Application**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The server starts at `http://localhost:5000`.
4.  **Launch Frontend Application**:
    Open a new terminal window, navigate to the frontend folder, and launch Vite:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The app client launches at `http://localhost:5173`.

---

## 🎨 Visual Design System
*   **Signature Medical Theme**: Consistent application of the `#0096C7` brand blue across menus, active states, borders, and buttons.
*   **Accessible Components**: Integration of Accessible Radix components and fluid loading skeleton placeholders to reduce Cumulative Layout Shift (CLS).
*   **Modern Interactions**: Soft hover effects, micro-animations (Framer Motion), and responsive layout grids.

---


