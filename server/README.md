# CaQuest Server (Backend API)

This handles the core business logic, database operations, and authentication for the CaQuest application. It is built using **Node.js, Express, and MongoDB**, and provides a RESTful API consumed by the React client.

## 🛠️ Tech Stack & Dependencies

- **Framework**: Express (v4.x)
- **Database Modeler**: Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer (Local storage for screenshots and assets)
- **Email Service**: Resend (`resend` SDK) for Automated Emails (Welcome, Payment Receipts, OTPs)
- **Security**: Helmet, CORS, Express Rate Limit, Express Mongo Sanitize
- **Validation**: Express Validator

## 🚀 Environment Configuration

Create a `.env` file in the root of the `/server` directory:

```env
# Application Settings
PORT=5000
NODE_ENV=development

# Frontend URI (for CORS whitelisting)
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/caquest?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Resend Email Configuration
EMAIL_USER=admin@caquest.com
EMAIL_FROM=CaQuest <noreply@caquest.com>
RESEND_API_KEY=re_your_resend_api_key_here
```

## 📂 Project Structure

```text
/server
├── /config         # Mongoose DB connection & environment
├── /controllers    # Express route handlers
├── /middleware     # Authentication, Error handling, Rate limiting
├── /models         # Mongoose User, Question, Subscription schema
├── /routes         # API endpoint definitions
├── /uploads        # Static file serving directory (e.g. payment screenshots)
└── /utils          # Helpers (Email templating, JWT Generators)
```

## 📡 Key API Routes

All endpoints are prefixed with `/api`.

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Subjects & Chapters**: `/api/subjects`, `/api/chapters`
- **Questions Engine**: `/api/questions`
  - *Note: Bulk Creation supports uploading multi-row CSV files.*
- **Progress & Tracking**: `/api/progress`, `/api/progress/bookmarks`
- **Subscriptions & Payments**: `/api/subscriptions`, `/api/payments`
- **Admin**: `/api/admin/users`, `/api/admin/system/stats`

## 🏃 Scripts

- `npm start`: Runs the server in production mode.
- `npm run dev`: Runs the server with Nodemon for hot reloads.
