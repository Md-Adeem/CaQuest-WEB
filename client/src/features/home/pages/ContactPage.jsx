import React, { useState } from "react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";
import SEO from '../../../shared/components/SEO';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/contact', formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CaQuest",
    "description": "Get in touch with the CaQuest support team for queries related to CA Foundation, Intermediate, or Final mock tests and platform access.",
    "publisher": {
      "@type": "Organization",
      "name": "CaQuest"
    },
    "mainEntity": {
      "@type": "Organization",
      "contactPoint": {
         "@type": "ContactPoint",
         "telephone": "+91-9876543210",
         "contactType": "customer support",
         "email": "support@caquest.com",
         "areaServed": "IN",
         "availableLanguage": "en"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Contact Us"
        description="Have questions about CaQuest or your CA prep? Reach out to our 24/7 dedicated support team for help with mock tests, subscriptions, or technical issues."
        keywords="Contact CaQuest, CaQuest support, CA exam help desk"
        schema={contactSchema}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Get in Touch
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Have questions about our plans, materials, or anything else? We're here to help!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
          {/* Contact Info */}
          <div className="bg-gray-900 text-white p-8 md:w-1/3 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <p className="text-gray-400 mb-8">Fill up the form and our Team will get back to you within 24 hours.</p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <HiPhone className="w-6 h-6 text-primary-400" />
                <span>+91 6203793113</span>
              </div>
              <div className="flex items-center space-x-4">
                <HiMail className="w-6 h-6 text-primary-400" />
                <span>helpcaquest@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <HiLocationMarker className="w-6 h-6 text-primary-400" />
                <span>Navrangpura, Ahmedabad, Gujarat, India</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Your Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Your Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
