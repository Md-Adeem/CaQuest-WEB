import React, { useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import SEO from "../../../shared/components/SEO";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is CaQuest?",
      answer: "CaQuest is an advanced online learning platform specifically designed for Chartered Accountancy students. We offer extensive mock tests, chapter-wise practice questions, and detailed analytics for CA Foundation, Intermediate, and Final exams."
    },
    {
      question: "Are your mock tests aligned with the latest ICAI syllabus?",
      answer: "Yes, all our questions and mock tests (including RTPs, MTPs, and PYQs) are continually updated to closely reflect the latest ICAI exam patterns and syllabus requirements."
    },
    {
      question: "Can I access the platform on my mobile phone?",
      answer: "Absolutely. CaQuest is fully responsive and optimized for all devices, including mobile phones, tablets, and desktop computers."
    },
    {
      question: "How do the subscription plans work?",
      answer: "We offer distinct subscription tiers for Foundation, Intermediate, and Final levels. Once subscribed, you get uninterrupted access to all subjects, chapters, and mock questions within that specific level until your plan expires."
    },
    {
      question: "Do you provide explanations for wrong answers?",
      answer: "Yes! Every question in our database comes with a comprehensive explanation and, where applicable, a detailed model answer to help you understand your mistakes."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Answer Engine Optimization (AEO) Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about CaQuest, CA mock exams, subscription plans, and how our platform helps you clear the ICAI exams."
        keywords="CaQuest FAQ, CA exam questions, ICAI mock tests support"
        schema={faqSchema}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Support</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Everything you need to know about preparing for your CA exams with CaQuest.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                {openIndex === index ? (
                  <HiOutlineChevronUp className="w-5 h-5 text-primary-600" />
                ) : (
                  <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
