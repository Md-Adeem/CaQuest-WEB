// client/src/features/home/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import SEO from '../../../shared/components/SEO';
import {
  HiAcademicCap,
  HiBookOpen,
  HiShieldCheck,
  HiLightningBolt,
  HiUsers,
  HiStar,
  HiCheckCircle,
  HiArrowRight,
} from "react-icons/hi";

const HomePage = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <HiBookOpen className="w-8 h-8" />,
      title: "Chapter-wise Questions",
      description:
        "Structured question banks organized by chapter for systematic preparation",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: "All CA Levels",
      description:
        "Complete coverage for Foundation, Intermediate, and Final levels",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    },
    {
      icon: <HiLightningBolt className="w-8 h-8" />,
      title: "Instant Feedback",
      description:
        "Get immediate answers with detailed explanations for every question",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: "Expert Curated",
      description:
        "Questions crafted by experienced CA professionals and educators",
      color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Practice Questions" },
    { value: "16", label: "Subjects Covered" },
    { value: "2,000+", label: "Active Students" },
    { value: "95%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      level: "CA Foundation",
      text: "The chapter-wise approach helped me focus on weak areas. Cleared my exam in first attempt!",
      rating: 5,
    },
    {
      name: "Rahul Patel",
      level: "CA Intermediate",
      text: "Best platform for CA preparation. The explanations are detailed and easy to understand.",
      rating: 5,
    },
    {
      name: "Ananya Gupta",
      level: "CA Final",
      text: "Affordable pricing and excellent question quality. Highly recommended for serious aspirants.",
      rating: 5,
    },
  ];

  const levels = [
    {
      name: "CA Foundation",
      icon: "🎯",
      papers: 4,
      color: "from-blue-500 to-blue-600",
      description: "Entry-level for aspiring Chartered Accountants",
    },
    {
      name: "CA Intermediate",
      icon: "📈",
      papers: 6,
      color: "from-purple-500 to-purple-600",
      description: "Build advanced knowledge in accounting & law",
    },
    {
      name: "CA Final",
      icon: "🏆",
      papers: 6,
      color: "from-amber-500 to-amber-600",
      description: "Master the final frontier of CA qualification",
    },
  ];

  const homeSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://caquest.com/#website",
                "url": "https://caquest.com",
                "name": "CaQuest",
                "description": "Master the CA exams with precision. CaQuest offers personalized practice, real-time analytics, and comprehensive mocks for Foundation, Intermediate, and Final levels.",
                "publisher": {
                    "@id": "https://caquest.com/#organization"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://caquest.com/#organization",
                "name": "CaQuest",
                "url": "https://caquest.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://caquest.com/logo.png"
                },
                "sameAs": [
                    "https://www.facebook.com/caquest",
                    "https://www.twitter.com/caquest",
                    "https://www.linkedin.com/company/caquest"
                ]
            }
        ]
    };

  return (
    <div className="min-h-screen">
      <SEO 
                title="Master CA Exams | Practice & Mocks"
                description="CaQuest is the ultimate platform for CA students. Access Foundation, Inter, and Final mock papers, chapter-wise MCQ practice, and detailed performance analytics."
                keywords="CA exams, CA foundation practice, CA inter mock tests, chartered accountancy, ICAI exam prep, CaQuest"
                schema={homeSchema}
            />
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                Trusted by 2000+ CA Students
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Ace Your CA Exams with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Confidence
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Practice thousands of chapter-wise questions with detailed
              explanations. Your one-stop platform for CA Foundation,
              Intermediate, and Final preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-white dark:bg-gray-800 text-primary-700 hover:bg-gray-100 dark:bg-gray-800 font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <HiArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white dark:bg-gray-800 text-primary-700 hover:bg-gray-100 dark:bg-gray-800 font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
                  >
                    Start Free Trial
                    <HiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="bg-white dark:bg-gray-800/10 backdrop-blur-sm hover:bg-white dark:bg-gray-800/20 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/20 text-lg"
                  >
                    View Pricing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 w-full">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.3C672 45.3 768 55.7 864 57.5C960 59.3 1056 52.7 1152 48.8C1248 45 1344 44 1392 43.5L1440 43V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              className="fill-gray-50 dark:fill-gray-900 transition-colors duration-300"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-primary-600">
                  {stat.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform is designed to give you the best preparation
              experience with features that matter
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center group hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              All CA Levels Covered
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Comprehensive question banks for every stage of your CA journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <div
                key={index}
                className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-r ${level.color} p-6 -m-6 mb-6 text-white`}
                >
                  <span className="text-4xl">{level.icon}</span>
                  <h3 className="text-xl font-bold mt-3">{level.name}</h3>
                  <p className="text-sm opacity-80 mt-1">{level.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {level.papers} Papers
                  </span>
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1"
                  >
                    {user ? "Go to Dashboard" : "Get Started"}{" "}
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Get started in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free and choose your CA level",
                icon: "👤",
              },
              {
                step: "02",
                title: "Subscribe",
                description: "Choose a plan according to your level",
                icon: "💳",
              },
              {
                step: "03",
                title: "Start Practicing",
                description:
                  "Access chapter-wise questions with detailed explanations",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-primary-600 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              What Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div key={index} className="card bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-primary-600">{t.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Start Your CA Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of successful CA students. Start practicing today.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="bg-white dark:bg-gray-800 text-primary-700 hover:bg-gray-100 dark:bg-gray-800 font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg inline-flex items-center gap-2"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
