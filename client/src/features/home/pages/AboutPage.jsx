import React from "react";
import { HiUserGroup, HiBookOpen, HiLightBulb } from "react-icons/hi";
import SEO from '../../../shared/components/SEO';

const AboutPage = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About CaQuest",
    "description": "CaQuest is a comprehensive platform designed to help students ace their CA journey with robust exams, mock tests, and analytics.",
    "publisher": {
      "@type": "Organization",
      "name": "CaQuest"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="About Us"
        description="Learn about CaQuest's mission to empower CA Students with industry-leading mock exams, practice tools, and personalized analytics to clear the ICAI."
        keywords="About CaQuest, CA platform, CA study tools, ICAI preparation company"
        schema={aboutSchema}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Empowering CA Students Worldwide
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            CaQuest is a comprehensive platform designed by professionals to help you ace your CA journey—from Foundation to Final.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <HiBookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Comprehensive Material</h3>
              <p className="mt-2 text-base text-gray-500">
                Extensive chapter-wise questions, mock tests, and curated learning materials tailored to the latest syllabus.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <HiLightBulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Smart Learning</h3>
              <p className="mt-2 text-base text-gray-500">
                Track your progress, identify weak areas, and optimize your study plan with our intelligent analytics dashboard.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <HiUserGroup className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Expert Community</h3>
              <p className="mt-2 text-base text-gray-500">
                Join a community of thousands of aspirants, get doubts solved, and stay motivated throughout your preparation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
