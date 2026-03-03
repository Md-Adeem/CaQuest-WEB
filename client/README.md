# CaQuest Client (Frontend App)

This is the beautifully designed, highly responsive frontend application for CaQuest, built with **React 19 & Vite**. It consumes the Express backend API and features dual interfaces for both Admins and Students.

## 🛠️ Tech Stack & Dependencies

- **Core Framework**: React 19 & Vite 
- **Styling**: Tailwind CSS (v3.4), Custom utility classes in `/styles`, and smooth animations/glassmorphism effects
- **Routing**: React Router DOM (v7.1)
- **State Management**: Context API (`AuthContext`), React Custom Hooks
- **Icons**: React Icons (`react-icons/hi` Heroicons)
- **Forms & Data**: Axios for API calls, React Hot Toast for modern notifications
- **Specialized Components**: 
  - `@uiw/react-md-editor` (Markdown Text Editor for subjective answers/tables)
  - `papaparse` (Browser-side CSV parsing engine for bulk uploads)

## 🚀 Environment Configuration

Create a `.env` file in the root of the `/client` directory:

```env
# Point this to your backend domain. For local development, use localhost.
VITE_API_URL=http://localhost:5000/api
```

## 📂 Project Structure

The project adopts a modernized, feature-sliced design (FSD) architecture:

```text
/client/src
├── /assets         # Static images, logos, and global CSS
├── /features       # Domain-specific modules
│   ├── /admin      # Admin specific pages (Users, Questions Bulk Uploads)
│   ├── /auth       # Login, Register, Protected Routes
│   ├── /dashboard  # Student dashboard and statistics
│   ├── /profile    # Profile edits, Password changes, Invoice histories
│   ├── /questions  # Question execution UI (Markdown rendering)
│   ├── /subjects   # Hierarchical views for Levels -> Subjects -> Chapters
│   └── /subscriptions # Payment plans, Stripe/Razorpay UI
├── /shared         # Global, reusable components
│   ├── /components # Navbar, Footer, Buttons, Modals, Badges, Shimmer Loaders
│   └── /utils      # Axios API instances, formatters
├── App.jsx         # Global Route Definitions
└── main.jsx        # React DOM Entrypoint
```

## 🎨 Key UI Features
- **Responsive Navigation**: Mobile-friendly Navbar with hamburger menus and bottom footers.
- **Glassmorphic Cards**: Used extensively on the Dashboard and Pricing pages for a premium, modern feel.
- **Shimmer Loaders**: 9 distinct custom shimmer loading skeletons (`Shimmer.jsx`) that perfectly match the layouts of Subjects, Chapters, Tables, and Questions while data is being fetched.
- **Markdown Rendering**: Capable of reading raw markdown from the database and rendering it securely using `rehype-sanitize`.

## 🏃 Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles the application for production deployment (e.g., to Vercel).
- `npm run lint`: Runs ESLint over the `/src` directory to catch syntax errors.
