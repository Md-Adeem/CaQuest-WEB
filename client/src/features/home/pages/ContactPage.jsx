import React, { useState } from "react";
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiChat } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";
import SEO from '../../../shared/components/SEO';
import A from '../../../shared/components/AnimateOnScroll';

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
      toast.error(error.response?.data?.message || "Failed to send message.");
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
    "description": "Get in touch with CaQuest support.",
    "publisher": { "@type": "Organization", "name": "CaQuest" },
    "mainEntity": {
      "@type": "Organization",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-6203793113",
        "contactType": "customer support",
        "email": "helpcaquest@gmail.com",
        "areaServed": "IN",
        "availableLanguage": "en"
      }
    }
  };

  const contactMethods = [
    { icon: <HiPhone className="w-5 h-5" />, label: "Phone", value: "+91 6203793113", gradient: "from-blue-500 to-cyan-500" },
    { icon: <HiMail className="w-5 h-5" />, label: "Email", value: "helpcaquest@gmail.com", gradient: "from-purple-500 to-fuchsia-500" },
    { icon: <HiLocationMarker className="w-5 h-5" />, label: "Address", value: "Navrangpura, Ahmedabad, Gujarat", gradient: "from-amber-500 to-orange-500" },
    { icon: <HiClock className="w-5 h-5" />, label: "Hours", value: "Mon-Sat, 9AM-6PM IST", gradient: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO 
        title="Contact Us"
        description="Have questions about CaQuest? Reach out to our dedicated support team."
        keywords="Contact CaQuest, CaQuest support, CA exam help desk"
        schema={contactSchema}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white py-20 md:py-28 transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-80px] right-[-60px] w-[350px] h-[350px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-100 dark:border-white/[0.12] mb-8">
            <HiChat className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/80">Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            We'd Love to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 mt-2">Hear From You</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-300/90 max-w-xl mx-auto font-medium">
            Have questions about plans, materials, or anything else? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((m, i) => (
              <A key={i} animation="scale-in" delay={i + 1} className="group relative">
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${m.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-5 text-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-11 h-11 bg-gradient-to-br ${m.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {m.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{m.label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{m.value}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Card */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <A animation="fade-up" className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-20 blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-10 md:w-2/5 flex flex-col justify-center">
                <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute bottom-[-30px] left-[-30px] w-[140px] h-[140px] bg-cyan-500/15 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <h3 className="text-2xl font-extrabold mb-3 relative z-10 tracking-tight">Send Us a Message</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium relative z-10">Fill up the form and we'll get back to you within 24 hours.</p>
                
                <div className="space-y-5 relative z-10">
                  {[
                    { icon: <HiPhone className="w-5 h-5 text-cyan-400" />, text: "+91 6203793113" },
                    { icon: <HiMail className="w-5 h-5 text-cyan-400" />, text: "helpcaquest@gmail.com" },
                    { icon: <HiLocationMarker className="w-5 h-5 text-cyan-400" />, text: "Ahmedabad, Gujarat" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 bg-white/[0.08] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/[0.08] group-hover/item:bg-white/[0.15] transition-colors shadow-sm">
                        {c.icon}
                      </div>
                      <span className="font-medium text-slate-200 text-sm">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="p-10 md:w-3/5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">Your Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required
                      className="block w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/60 rounded-xl py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">Your Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                      className="block w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/60 rounded-xl py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">Message</label>
                    <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required
                      className="block w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/60 rounded-xl py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black py-4 px-6 rounded-xl text-sm tracking-widest uppercase shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </A>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
