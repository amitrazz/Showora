# 🚀 Showora

> **A modern, enterprise-grade Showroom Management Platform built for bike dealerships.**

Showora is a production-ready showroom management system designed to streamline the complete dealership lifecycle—from procurement and inventory management to sales, invoicing, expenses, and business analytics.

Built with a modern SaaS architecture, Showora focuses on exceptional user experience, scalable frontend architecture, and enterprise-level workflows. The project currently uses realistic mock data through a service layer, making it easy to switch to real backend APIs without changing the UI.

---

## ✨ Features

### 📊 Dashboard

* Business KPIs
* Revenue analytics
* Sales trends
* Inventory overview
* Expense summary
* Recent activities
* Quick actions

### 👥 Customer Management

* Customer workspace
* Customer profiles
* Purchase history
* Outstanding payments
* Document management
* Activity timeline
* Customer notes
* Advanced search & filters

### 📦 Inventory Management

* Vehicle inventory
* VIN / Engine / Chassis tracking
* Inventory movement
* Stock health monitoring
* Reservation & allocation
* Inventory aging
* Supplier linkage

### 🛒 Purchase Management

* Purchase Orders
* Supplier management
* Inventory receiving
* Payment tracking
* Procurement analytics
* Purchase history

### 💰 Sales Management

* Complete sales workflow
* Vehicle reservation
* Customer selection
* Pricing calculator
* Finance integration
* Delivery management
* Payment tracking

### 🧾 Invoice Management

* Professional invoice generation
* GST calculations
* PDF preview
* Print & download
* Payment history
* Outstanding tracking

### 💳 Expense Management

* Expense tracking
* Categories
* Vendor management
* Receipt uploads
* Budget monitoring
* Approval workflow
* Expense analytics

### 📈 Reports & Analytics

* Executive dashboard
* Revenue reports
* Inventory reports
* Customer analytics
* Expense analytics
* Profit insights
* Interactive charts
* Export capabilities

### ⚙️ Settings

* Organization settings
* Branch management
* User management
* Roles & permissions
* Notification preferences
* Tax configuration
* Appearance settings
* Security policies

---

# 🎯 Design Philosophy

Showora is designed to feel like a modern SaaS product rather than a traditional ERP.

Inspired by:

* Linear
* Stripe Dashboard
* Vercel
* Attio
* Notion
* Mercury
* Ramp

Design principles:

* Minimal UI
* Premium user experience
* High information density
* Responsive layouts
* Smooth animations
* Keyboard-first interactions
* Dark mode support
* Accessibility-focused

---

# 🏗 Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* shadcn/ui
* TanStack Router
* TanStack Query
* TanStack Table
* React Hook Form
* Zod
* Zustand
* Axios
* Recharts
* Lucide React
* Framer Motion

---

# 📁 Project Structure

```text
src/
│
├── app/
├── assets/
├── components/
│   ├── common/
│   ├── layouts/
│   └── ui/
│
├── constants/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── customers/
│   ├── inventory/
│   ├── purchases/
│   ├── sales/
│   ├── invoices/
│   ├── expenses/
│   ├── reports/
│   └── settings/
│
├── hooks/
├── lib/
├── router/
├── services/
├── store/
├── types/
├── utils/
└── main.tsx
```

---

# 🧩 Architecture

The application follows a scalable, feature-first architecture.

```
Page
   │
   ▼
Hook
   │
   ▼
Service
   │
   ▼
Mock Data (data.ts)

Later

Page
   │
   ▼
Hook
   │
   ▼
Service
   │
   ▼
REST API
```

Components never communicate directly with APIs or mock data.

---

# 🗂 Mock Data Strategy

Every feature contains its own `data.ts` file containing realistic production-like mock data.

```
customers/
├── data.ts
├── services.ts
├── hooks.ts
└── components/
```

This allows replacing the service implementation with API calls later without changing any UI components.

---

# 📱 Core Modules

* Dashboard
* Customers
* Inventory
* Purchases
* Sales
* Invoices
* Expenses
* Reports
* Settings

---

# 🎨 UX Highlights

* Enterprise dashboard
* Interactive charts
* Smart tables
* Advanced filtering
* Multi-step forms
* Keyboard shortcuts
* Skeleton loading
* Empty states
* Responsive layouts
* Dark mode
* Modern micro-interactions

---

# 🚀 Getting Started

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

---

# 🔮 Roadmap

### Phase 1

* Frontend foundation
* Mock data architecture
* Core business modules
* Responsive UI
* Dashboard
* Reports

### Phase 2

* Backend API integration
* Authentication
* Role-based access control
* File uploads
* Notifications

### Phase 3

* Multi-tenant architecture
* Branch management
* White-label support
* Mobile application
* AI-powered insights

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome. Please open an issue before submitting significant changes.

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Showora — Modern Showroom Management Platform**

Designed with scalability, maintainability, and exceptional user experience in mind.

</div>
