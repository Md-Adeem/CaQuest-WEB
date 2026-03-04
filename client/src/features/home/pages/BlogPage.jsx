import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO";
import { blogPosts } from "../data/blogPosts";

const BlogPage = () => {
  // Blog Schema for AEO/GEO
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CaQuest Official Blog",
    "description": "Study tips, ICAI news, and mock test strategies for CA students.",
    "publisher": {
      "@type": "Organization",
      "name": "CaQuest"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": new Date(post.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "description": post.excerpt
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Official Blog | Exam Tips & News"
        description="Read the latest study strategies, ICAI news updates, and expert advice for conquering your Chartered Accountancy exams on the CaQuest blog."
        keywords="CA study tips, ICAI exam news, CA Intermediate strategy, CA Foundation updates, CaQuest blog"
        schema={blogSchema}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Resources</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            CaQuest Blog
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Insights, study guides, and the latest news to help you conquer the ICAI exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <Link to={`/blog/${post.id}`} className="h-48 w-full relative block">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </div>
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span className="font-medium text-primary-600">{post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  <Link to={`/blog/${post.id}`} className="hover:text-primary-600 cursor-pointer transition-colors block">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} className="text-primary-600 font-medium text-sm hover:text-primary-800 self-start">
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
