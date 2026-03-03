# CaQuest Web Application

CaQuest is a comprehensive, modern web application designed for CA (Chartered Accountancy) students. It provides a robust platform for practice questions, mock tests, subject/chapter organization, and subscription-based access levels (Foundation, Intermediate, Final). 

This repository contains the full monorepo stack, split into a React frontend client and a Node.js/Express backend server.

---

## 🏗️ Architecture

The application is built using the MERN stack (MongoDB, Express, React, Node.js). 
To maintain a clean separation of concerns, the project is divided into two primary directories:

- `/client` - The Vite + React frontend application
- `/server` - The Node.js + Express backend API

### Key Technologies
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, React Query, Context API
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Auth
- **Features**: Razorpay Integration (Planned), Resend Email API, PapaParse CSV Bulk Uploads, UIW Markdown Editor

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)

### 1. Backend Setup (`/server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory and configure your environment variables (see `/server/README.md` for the full list).
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The server will typically run on `http://localhost:5000`.*

### 2. Frontend Setup (`/client`)

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/client` directory (see `/client/README.md` for details).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will typically run on `http://localhost:5173`.*

---

## 🌟 Core Features

- **Role-Based Access Control**: Separate dashboards and permissions for `student` and `admin` roles.
- **Subscription Management**: Access control to specific subjects and chapters based on active subscription tiers.
- **Dynamic Practice Engine**: Support for both Multiple Choice Questions (MCQ) and Subjective questions with Markdown rich-text formatting.
- **Admin Dashboard**: Comprehensive control over user management, subscription approvals, subject/chapter hierarchy, and bulk CSV question uploads.
- **Student Profile**: Custom profile management with invoice and payment history tracking.

---

## 📖 Further Documentation

For detailed information on the specific domains of the application, please refer to the README files located within their respective directories:

- [Frontend Documentation (Client)](./client/README.md)
- [Backend Documentation (Server)](./server/README.md)
