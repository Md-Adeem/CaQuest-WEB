import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiOutlineShare, HiOutlineLink, HiOutlineClock } from 'react-icons/hi';
import SEO from '../../../shared/components/SEO';
import { blogPosts } from '../data/blogPosts';

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  // Get up to 3 related posts (excluding the current one)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== parseInt(id))
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the blog post you're looking for.</p>
        <Link to="/blog" className="btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  // Inject highly specific JSON-LD just for this article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": post.title,
    "image": post.imageUrl,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CaQuest",
      "logo": {
        "@type": "ImageObject",
        "url": "https://caquest.com/logo.png"
      }
    },
    "datePublished": new Date(post.date).toISOString(),
    "description": post.excerpt
  };

  return (
    <article className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, CA exams, CaQuest`}
        image={post.imageUrl}
        schema={articleSchema}
      />
      
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
        >
          <HiArrowLeft className="mr-2 w-4 h-4" />
          Back to all articles
        </Link>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 h-[400px] relative">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-6 left-6 bg-primary-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
            {post.category}
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 -mt-20 relative z-10 mx-4 md:mx-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
            <span>Published on {post.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="text-primary-600">{post.author}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>

          {/* Markdown Content parsed cleanly */}
          <div className="prose prose-lg prose-primary max-w-none text-gray-700">
            {post.content.split('\n\n').map((paragraph, index) => (
              paragraph.startsWith('###') ? (
                <h3 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-5 pb-2 border-b border-gray-100">
                  {paragraph.replace('### ', '')}
                </h3>
              ) : (
                <p key={index} className={`mb-6 leading-relaxed text-lg text-gray-700 ${index === 0 ? 'first-letter:text-7xl first-letter:font-extrabold first-letter:text-primary-600 first-letter:float-left first-letter:mr-3 first-letter:-mt-2 first-line:uppercase first-line:tracking-widest' : ''}`}>
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {/* Share & Author Section */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="https://ui-avatars.com/api/?name=CaQuest+Team&background=0284c7&color=fff&size=50" 
                alt={post.author} 
                className="w-12 h-12 rounded-full shadow-sm"
              />
              <div>
                <p className="font-bold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">Editor & CA Mentor</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 mr-2">Share:</span>
              <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors" title="Share via Link">
                <HiOutlineLink className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors" title="Share Article">
                <HiOutlineShare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="max-w-7xl mx-auto mt-24">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-primary-600 pl-4">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map(related => (
            <div key={related.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <Link to={`/blog/${related.id}`} className="h-40 w-full relative block">
                <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover" />
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-2 leading-tight">
                  <Link to={`/blog/${related.id}`} className="hover:text-primary-600 transition-colors line-clamp-2">
                    {related.title}
                  </Link>
                </h4>
                <p className="text-xs text-gray-500 mb-4 flex items-center">
                  <HiOutlineClock className="w-3.5 h-3.5 mr-1" />
                  {related.date}
                </p>
                <Link to={`/blog/${related.id}`} className="mt-auto text-sm font-medium text-primary-600 hover:text-primary-800">
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
