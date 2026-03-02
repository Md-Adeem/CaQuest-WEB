import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";

// Shared
import Navbar from "./shared/components/Navbar";
import Footer from "./shared/components/Footer";
import Loader from "./shared/components/Loader";

// Auth
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

// Home
import HomePage from "./features/home/pages/HomePage";
import AboutPage from "./features/home/pages/AboutPage";
import ContactPage from "./features/home/pages/ContactPage";

// Student
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import SubjectsPage from "./features/subjects/pages/SubjectsPage";
import ChaptersPage from "./features/subjects/pages/ChaptersPage";
import QuestionsPage from "./features/questions/pages/QuestionsPage";
import SubscriptionPage from "./features/subscription/pages/SubscriptionPage";
import PaymentPage from "./features/subscription/pages/PaymentPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
// ========= LAZY LOADED PAGES =========
const QuizPage = lazy(() => import("./features/quiz/pages/QuizPage"));
const ProgressPage = lazy(() =>
  import("./features/progress/pages/ProgressPage")
);
const BookmarksPage = lazy(() =>
  import("./features/progress/pages/BookmarksPage")
);

const AdminDashboardPage = lazy(() =>
  import("./features/admin/pages/AdminDashboardPage")
);
const PaymentApprovalsPage = lazy(() =>
  import("./features/admin/pages/PaymentApprovalsPage")
);
const ContentManagementPage = lazy(() =>
  import("./features/admin/pages/ContentManagementPage")
);
const QuestionManagementPage = lazy(() =>
  import("./features/admin/pages/QuestionManagementPage")
);
const PlanManagementPage = lazy(() =>
  import("./features/admin/pages/PlanManagementPage")
);
const StudentManagementPage = lazy(() =>
  import("./features/admin/pages/StudentManagementPage")
);

import NotFoundPage from "./shared/components/NotFoundPage";

const LazyRoute = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* ========= PUBLIC ========= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
          />
          <Route path="/subscriptions" element={<SubscriptionPage />} />

          {/* ========= STUDENT ========= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:level"
            element={
              <ProtectedRoute>
                <SubjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapters/:subjectId"
            element={
              <ProtectedRoute>
                <ChaptersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:chapterId"
            element={
              <ProtectedRoute>
                <QuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:chapterId"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <QuizPage />
                </LazyRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:planId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* ========= ADMIN ========= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute adminOnly>
                <StudentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute adminOnly>
                <PaymentApprovalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute adminOnly>
                <ContentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute adminOnly>
                <QuestionManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <ProtectedRoute adminOnly>
                <PlanManagementPage />
              </ProtectedRoute>
            }
          />

          {/* ========= FALLBACK ========= */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
