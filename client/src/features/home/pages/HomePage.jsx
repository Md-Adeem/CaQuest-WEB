// client/src/features/home/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import SEO from '../../../shared/components/SEO';
import A from '../../../shared/components/AnimateOnScroll';
import {
  HiAcademicCap,
  HiBookOpen,
  HiShieldCheck,
  HiLightningBolt,
  HiStar,
  HiCheckCircle,
  HiArrowRight,
  HiChartBar,
  HiUsers,
} from "react-icons/hi";

const HomePage = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <HiBookOpen className="w-7 h-7" />,
      title: "Chapter-wise Questions",
      description:
        "Structured question banks organized by chapter for systematic preparation",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <HiAcademicCap className="w-7 h-7" />,
      title: "All CA Levels",
      description:
        "Complete coverage for Foundation, Intermediate, and Final levels",
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      icon: <HiLightningBolt className="w-7 h-7" />,
      title: "Instant Feedback",
      description:
        "Get immediate answers with detailed explanations for every question",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <HiShieldCheck className="w-7 h-7" />,
      title: "Expert Curated",
      description:
        "Questions crafted by experienced CA professionals and educators",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Practice Questions", icon: <HiBookOpen className="w-6 h-6" />, gradient: "from-blue-500 to-cyan-500" },
    { value: "16", label: "Subjects Covered", icon: <HiChartBar className="w-6 h-6" />, gradient: "from-purple-500 to-fuchsia-500" },
    { value: "2,000+", label: "Active Students", icon: <HiUsers className="w-6 h-6" />, gradient: "from-amber-500 to-orange-500" },
    { value: "95%", label: "Success Rate", icon: <HiCheckCircle className="w-6 h-6" />, gradient: "from-emerald-500 to-teal-500" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      level: "CA Foundation",
      text: "The chapter-wise approach helped me focus on weak areas. Cleared my exam in first attempt!",
      rating: 5,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Rahul Patel",
      level: "CA Intermediate",
      text: "Best platform for CA preparation. The explanations are detailed and easy to understand.",
      rating: 5,
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      name: "Ananya Gupta",
      level: "CA Final",
      text: "Affordable pricing and excellent question quality. Highly recommended for serious aspirants.",
      rating: 5,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const levels = [
    {
      name: "CA Foundation",
      icon: "🎯",
      papers: 4,
      gradient: "from-blue-600 to-cyan-500",
      shadow: "shadow-blue-500/25",
      description: "Entry-level for aspiring Chartered Accountants",
      features: ["4 Papers", "1000+ Questions", "Mock Tests"],
    },
    {
      name: "CA Intermediate",
      icon: "📈",
      papers: 6,
      gradient: "from-purple-600 to-fuchsia-500",
      shadow: "shadow-purple-500/25",
      description: "Build advanced knowledge in accounting & law",
      features: ["6 Papers", "2000+ Questions", "Analytics"],
    },
    {
      name: "CA Final",
      icon: "🏆",
      papers: 6,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/25",
      description: "Master the final frontier of CA qualification",
      features: ["6 Papers", "2000+ Questions", "Premium"],
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
        "description": "Master the CA exams with precision.",
        "publisher": { "@id": "https://caquest.com/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "https://caquest.com/#organization",
        "name": "CaQuest",
        "url": "https://caquest.com",
        "logo": { "@type": "ImageObject", "url": "https://caquest.com/logo.png" },
        "sameAs": ["https://www.facebook.com/caquest", "https://www.twitter.com/caquest", "https://www.linkedin.com/company/caquest"]
      }
    ]
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO 
        title="Master CA Exams | Practice & Mocks"
        description="CaQuest is the ultimate platform for CA students. Access Foundation, Inter, and Final mock papers, chapter-wise MCQ practice, and detailed performance analytics."
        keywords="CA exams, CA foundation practice, CA inter mock tests, chartered accountancy, ICAI exam prep, CaQuest"
        schema={homeSchema}
      />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white min-h-[90vh] flex items-center transition-colors duration-500">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        {/* Ambient orbs */}
        <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-fuchsia-200/10 dark:bg-fuchsia-500/8 rounded-full blur-[160px] pointer-events-none"></div>
        {/* Floating particles */}
        <div className="absolute top-20 left-[15%] w-2 h-2 bg-indigo-400/30 dark:bg-cyan-400/40 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-cyan-400/30 dark:bg-indigo-400/40 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-[25%] w-1 h-1 bg-purple-400/30 dark:bg-fuchsia-400/40 rounded-full animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <A animation="fade-down" className="inline-flex items-center gap-2.5 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl rounded-full px-6 py-3 mb-10 border border-indigo-100 dark:border-white/[0.12] shadow-lg dark:shadow-2xl dark:shadow-indigo-500/10">
              <div className="flex -space-x-1.5">
                {['🎓', '📚', '✨'].map((e, i) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs border border-indigo-200 dark:border-indigo-400/20">{e}</span>
                ))}
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-700 dark:text-white/90">
                Trusted by 2,000+ CA Students
              </span>
              <HiStar className="w-4 h-4 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
            </A>

            <A animation="blur-in" delay={1}><h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight">
              Ace Your
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400">CA Exams</span>
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 120 2 150 6C180 10 250 4 298 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round"/>
                  <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0"><stop stopColor="#818CF8"/><stop offset="0.5" stopColor="#22D3EE"/><stop offset="1" stopColor="#34D399"/></linearGradient></defs>
                </svg>
              </span>
            </h1></A>
            <A animation="fade-up" delay={2}><p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-slate-300/90 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Practice thousands of chapter-wise questions with detailed
              explanations for Foundation, Intermediate & Final.
            </p></A>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group relative bg-gradient-to-r from-indigo-500 to-cyan-500 font-black py-4 px-12 rounded-2xl transition-all shadow-2xl shadow-indigo-500/30 text-base flex items-center justify-center gap-3 tracking-wide hover:scale-105 active:scale-95 overflow-hidden text-white"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <HiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative bg-gradient-to-r from-indigo-500 to-cyan-500 font-black py-4 px-12 rounded-2xl transition-all shadow-2xl shadow-indigo-500/30 text-base flex items-center justify-center gap-3 tracking-wide hover:scale-105 active:scale-95 overflow-hidden text-white"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <HiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="group bg-white/80 dark:bg-white/[0.08] backdrop-blur-xl hover:bg-white dark:hover:bg-white/[0.15] text-gray-700 dark:text-white font-bold py-4 px-10 rounded-2xl transition-all border border-gray-200 dark:border-white/[0.15] text-base tracking-wide hover:scale-105 active:scale-95 shadow-lg dark:shadow-xl"
                  >
                    View Pricing
                  </Link>
                </>
              )}
            </div>
            {/* Mini stats under CTA */}
            <div className="flex flex-wrap justify-center gap-8 mt-14">
              {[{v: "5K+", l: "Questions"}, {v: "95%", l: "Pass Rate"}, {v: "3", l: "CA Levels"}].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{s.v}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-slate-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.3C672 45.3 768 55.7 864 57.5C960 59.3 1056 52.7 1152 48.8C1248 45 1344 44 1392 43.5L1440 43V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" className="fill-white dark:fill-gray-900 transition-colors duration-300" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <A key={index} animation="scale-in" delay={index + 1} className="group relative">
                {/* Glow border */}
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-6 text-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <p className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} tracking-tight`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-2">{stat.label}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <A animation="fade-up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800/50 mb-6">
              <HiLightningBolt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
              Everything You Need
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">to Succeed</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
              Built for serious CA aspirants who want the best preparation
            </p>
          </A>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <A key={index} animation="fade-up" delay={index + 1} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-7 text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LEVELS ═══════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(99,102,241,0.12),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <A animation="fade-up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full border border-amber-100 dark:border-amber-800/50 mb-6">
              <HiAcademicCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">CA Levels</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
              All CA Levels
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300">Covered</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Comprehensive question banks for every stage of your journey
            </p>
          </A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <A key={index} animation="zoom-rotate" delay={index + 1} className={`group relative overflow-hidden rounded-3xl shadow-2xl ${level.shadow} hover:-translate-y-2 transition-all duration-300`}>
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${level.gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                  <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">{level.icon}</span>
                  <h3 className="text-2xl font-extrabold tracking-tight">{level.name}</h3>
                  <p className="text-sm opacity-85 mt-1 font-medium">{level.description}</p>
                </div>
                {/* Content */}
                <div className="bg-white dark:bg-gray-800 p-6">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {level.features.map((f, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r ${level.gradient} text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all`}
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <A animation="fade-up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50 mb-6">
              <HiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
              How It
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300"> Works</span>
            </h2>
          </A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5">
              <div className="w-full h-full bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 dark:from-indigo-700 dark:via-cyan-700 dark:to-emerald-700 rounded-full"></div>
            </div>

            {[
              { step: "01", title: "Create Account", description: "Sign up for free and choose your CA level", icon: "👤", gradient: "from-indigo-500 to-blue-500" },
              { step: "02", title: "Subscribe", description: "Choose a plan according to your level", icon: "💳", gradient: "from-cyan-500 to-teal-500" },
              { step: "03", title: "Start Practicing", description: "Access chapter-wise questions with detailed explanations", icon: "🚀", gradient: "from-emerald-500 to-green-500" },
            ].map((item, index) => (
              <A key={index} animation="fade-up" delay={index + 1} className="text-center relative z-10 group">
                <div className="relative inline-block mb-6">
                  <div className={`w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center text-5xl shadow-2xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-full flex items-center justify-center text-[11px] font-black text-indigo-600 dark:text-indigo-400 shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">{item.description}</p>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <A animation="fade-up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-full border border-yellow-100 dark:border-yellow-800/50 mb-6">
              <HiStar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
              What Students
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-300"> Say</span>
            </h2>
          </A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <A key={index} animation="fade-up" delay={index + 1} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${t.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 shadow-md group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <HiStar key={i} className="w-5 h-5 text-yellow-400 drop-shadow-sm" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed font-medium flex-1 text-lg">"{t.text}"</p>
                  <div className="flex items-center gap-4 pt-5 border-t border-gray-100 dark:border-gray-700/60">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-black text-base shadow-lg`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white tracking-tight">{t.name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t.level}</p>
                    </div>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-80px] right-[-40px] w-[500px] h-[500px] bg-indigo-300/15 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-60px] left-[-40px] w-[400px] h-[400px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-100 dark:border-white/[0.12] mb-8">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/80">Join 2,000+ students</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Ready to Start Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 mt-2">CA Journey?</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-slate-300/90 mb-10 font-medium max-w-xl mx-auto">
            Join thousands of successful CA students. Start practicing today.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-cyan-500 font-black py-4 px-14 rounded-2xl transition-all shadow-2xl shadow-indigo-500/30 text-base tracking-wide hover:scale-105 active:scale-95 overflow-hidden text-white"
          >
            <span className="relative z-10">{user ? "Go to Dashboard" : "Get Started for Free"}</span>
            <HiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
