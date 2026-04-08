import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineChevronDown, HiQuestionMarkCircle, HiArrowRight } from "react-icons/hi";
import SEO from "../../../shared/components/SEO";
import A from '../../../shared/components/AnimateOnScroll';

const FAQPage = () => {
  const faqs = [
    { question: "What is CaQuest?", answer: "CaQuest is an advanced online learning platform specifically designed for Chartered Accountancy students. We offer extensive mock tests, chapter-wise practice questions, and detailed analytics for CA Foundation, Intermediate, and Final exams." },
    { question: "Are your mock tests aligned with the latest ICAI syllabus?", answer: "Yes, all our questions and mock tests (including RTPs, MTPs, and PYQs) are continually updated to closely reflect the latest ICAI exam patterns and syllabus requirements." },
    { question: "Can I access the platform on my mobile phone?", answer: "Absolutely. CaQuest is fully responsive and optimized for all devices, including mobile phones, tablets, and desktop computers." },
    { question: "How do the subscription plans work?", answer: "We offer distinct subscription tiers for Foundation, Intermediate, and Final levels. Once subscribed, you get uninterrupted access to all subjects, chapters, and mock questions within that specific level until your plan expires." },
    { question: "Do you provide explanations for wrong answers?", answer: "Yes! Every question in our database comes with a comprehensive explanation and, where applicable, a detailed model answer to help you understand your mistakes." },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question", "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO title="Frequently Asked Questions (FAQ)" description="Find answers about CaQuest, CA mock exams, and subscription plans." keywords="CaQuest FAQ, CA exam questions" schema={faqSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white py-20 md:py-28 transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-80px] left-[-60px] w-[350px] h-[350px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-60px] right-[-40px] w-[300px] h-[300px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-100 dark:border-white/[0.12] mb-8">
            <HiQuestionMarkCircle className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/80">Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 mt-2">Questions</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-300/90 max-w-xl mx-auto font-medium">
            Everything you need to know about preparing for your CA exams with CaQuest.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <A key={index} animation="fade-up" delay={Math.min(index + 1, 6)} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl transition-opacity duration-500 blur-sm ${openIndex === index ? 'opacity-50' : 'opacity-0 group-hover:opacity-30'}`}></div>
                <div className={`relative bg-white dark:bg-gray-800 border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "border-indigo-200 dark:border-indigo-700/60 shadow-lg" : "border-gray-100 dark:border-gray-700/60 hover:shadow-md"
                }`}>
                  <button className="w-full px-6 py-5 text-left focus:outline-none flex justify-between items-center gap-4" onClick={() => toggleFAQ(index)}>
                    <span className={`font-extrabold tracking-tight transition-colors text-base ${openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${openIndex === index ? "bg-indigo-100 dark:bg-indigo-900/50 rotate-180" : "bg-gray-100 dark:bg-gray-700/50"}`}>
                      <HiOutlineChevronDown className={`w-5 h-5 transition-colors ${openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-6 pb-5 pt-0">
                      <div className="h-px bg-gradient-to-r from-indigo-200 via-transparent to-transparent dark:from-indigo-800 mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-60px] right-[-40px] w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Still Have <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Questions?</span>
          </h2>
          <p className="text-slate-300/90 mb-8 font-medium">We'd love to help. Reach out to our support team.</p>
          <Link to="/contact" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-cyan-500 font-black py-3.5 px-10 rounded-2xl shadow-2xl shadow-indigo-500/30 text-sm tracking-wide hover:scale-105 active:scale-95 transition-all overflow-hidden">
            <span className="relative z-10">Contact Support</span>
            <HiArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
