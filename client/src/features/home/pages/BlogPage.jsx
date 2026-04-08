import React from "react";
import { Link } from "react-router-dom";
import { HiBookOpen } from "react-icons/hi";
import SEO from "../../../shared/components/SEO";
import A from '../../../shared/components/AnimateOnScroll';
import { blogPosts } from "../data/blogPosts";

const BlogPage = () => {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CaQuest Official Blog",
    "description": "Study tips, ICAI news, and mock test strategies.",
    "publisher": { "@type": "Organization", "name": "CaQuest" },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting", "headline": post.title, "datePublished": new Date(post.date).toISOString(),
      "author": { "@type": "Person", "name": post.author }, "description": post.excerpt
    }))
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO title="Official Blog | Exam Tips & News" description="Read the latest study strategies and ICAI news on the CaQuest blog." keywords="CA study tips, ICAI exam news, CaQuest blog" schema={blogSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 text-gray-900 dark:text-white py-20 md:py-28 transition-colors duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-80px] right-[-60px] w-[350px] h-[350px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] bg-cyan-300/15 dark:bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-100 dark:border-white/[0.12] mb-8">
            <HiBookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/80">Resources</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            CaQuest
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 mt-2">Blog</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-300/90 max-w-xl mx-auto font-medium">
            Insights, study guides, and the latest news to conquer the ICAI exams.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <A key={post.id} animation="fade-up" delay={Math.min(blogPosts.indexOf(post) + 1, 6)} className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 flex flex-col overflow-hidden">
                  <Link to={`/blog/${post.id}`} className="h-52 w-full relative block overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                      {post.category}
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 mb-3">
                      <span>{post.date}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{post.author}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
                      <Link to={`/blog/${post.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{post.title}</Link>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 flex-1 leading-relaxed font-medium">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 self-start transition-colors group/link">
                      Read Article <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
