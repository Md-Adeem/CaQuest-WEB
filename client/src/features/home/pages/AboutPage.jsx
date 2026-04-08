import React from "react";
import { Link } from "react-router-dom";
import { HiUserGroup, HiBookOpen, HiLightBulb, HiArrowRight, HiShieldCheck, HiStar, HiChartBar } from "react-icons/hi";
import SEO from '../../../shared/components/SEO';
import A from '../../../shared/components/AnimateOnScroll';

const AboutPage = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About CaQuest",
    "description": "CaQuest is a comprehensive platform designed to help students ace their CA journey.",
    "publisher": { "@type": "Organization", "name": "CaQuest" }
  };

  const pillars = [
    {
      icon: <HiBookOpen className="w-7 h-7" />,
      title: "Comprehensive Material",
      description: "Extensive chapter-wise questions, mock tests, and curated learning materials tailored to the latest syllabus.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <HiLightBulb className="w-7 h-7" />,
      title: "Smart Learning",
      description: "Track your progress, identify weak areas, and optimize your study plan with our intelligent analytics.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <HiUserGroup className="w-7 h-7" />,
      title: "Expert Community",
      description: "Join thousands of aspirants, get doubts solved, and stay motivated throughout your prep.",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const values = [
    { icon: <HiShieldCheck className="w-6 h-6" />, title: "Quality First", desc: "Every question is reviewed by CA professionals.", gradient: "from-indigo-500 to-blue-500" },
    { icon: <HiStar className="w-6 h-6" />, title: "Student Success", desc: "95% of our students clear their exams.", gradient: "from-amber-500 to-orange-500" },
    { icon: <HiChartBar className="w-6 h-6" />, title: "Data Driven", desc: "Analytics that help you study smarter.", gradient: "from-emerald-500 to-teal-500" },
    { icon: <HiUserGroup className="w-6 h-6" />, title: "Community", desc: "Learn together, grow together.", gradient: "from-purple-500 to-fuchsia-500" },
  ];

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO 
        title="About Us"
        description="Learn about CaQuest's mission to empower CA Students with industry-leading mock exams."
        keywords="About CaQuest, CA platform, CA study tools"
        schema={aboutSchema}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white py-24 md:py-32 transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-80px] right-[-60px] w-[350px] h-[350px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-100 dark:border-white/[0.12] mb-8">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/80">Our Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Empowering CA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 mt-2">Students Worldwide</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-slate-300/90 max-w-2xl mx-auto font-medium leading-relaxed">
            CaQuest is a comprehensive platform designed by professionals to help you ace your CA journey—from Foundation to Final.
          </p>
        </div>
      </section>

      {/* Pillar Cards */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <A animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">CaQuest?</span>
            </h2>
          </A>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <A key={index} animation="fade-up" delay={index + 1} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${pillar.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${pillar.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">{pillar.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{pillar.description}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <A animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Values</span>
            </h2>
          </A>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <A key={i} animation="scale-in" delay={i + 1} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${v.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${v.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {v.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{v.desc}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-60px] right-[-40px] w-[400px] h-[400px] bg-indigo-300/15 dark:bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">Join Us?</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-slate-300/90 mb-10 font-medium max-w-xl mx-auto">
            Start your journey with thousands of successful CA aspirants.
          </p>
          <Link
            to="/register"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-cyan-500 font-black py-4 px-14 rounded-2xl shadow-2xl shadow-indigo-500/30 text-base tracking-wide hover:scale-105 active:scale-95 transition-all overflow-hidden text-white"
          >
            <span className="relative z-10">Get Started Free</span>
            <HiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
