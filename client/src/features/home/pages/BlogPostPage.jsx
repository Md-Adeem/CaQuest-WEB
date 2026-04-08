import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiOutlineShare, HiOutlineLink, HiOutlineClock, HiBookOpen } from 'react-icons/hi';
import SEO from '../../../shared/components/SEO';
import { blogPosts } from '../data/blogPosts';

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));
  const relatedPosts = blogPosts.filter((p) => p.id !== parseInt(id)).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen -mt-16 md:-mt-[72px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4">
        <div className="text-7xl mb-8">📄</div>
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Article Not Found</h1>
        <p className="text-slate-300 mb-8 font-medium">We couldn't find the blog post you're looking for.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black py-3.5 px-10 rounded-2xl text-sm tracking-widest uppercase shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all">
          Back to Blog
        </Link>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href },
    "headline": post.title, "image": post.imageUrl,
    "author": { "@type": "Person", "name": post.author },
    "publisher": { "@type": "Organization", "name": "CaQuest", "logo": { "@type": "ImageObject", "url": "https://caquest.com/logo.png" } },
    "datePublished": new Date(post.date).toISOString(), "description": post.excerpt
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px]">
      <SEO title={post.title} description={post.excerpt} keywords={`${post.category}, CA exams, CaQuest`} image={post.imageUrl} schema={articleSchema} />

      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 to-transparent"></div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/80 hover:text-white mb-6 transition-colors bg-white/[0.08] backdrop-blur-xl px-4 py-2 rounded-full border border-white/[0.1]">
              <HiArrowLeft className="w-3.5 h-3.5" />
              Back to Blog
            </Link>
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest inline-block mb-4">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/70">
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span className="text-cyan-400">{post.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <article className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-10 blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 md:p-12 shadow-xl">
              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  paragraph.startsWith('###') ? (
                    <h3 key={index} className="text-2xl font-extrabold text-gray-900 dark:text-white mt-10 mb-5 pb-3 border-b border-gray-100 dark:border-gray-700/60 tracking-tight">
                      {paragraph.replace('### ', '')}
                    </h3>
                  ) : (
                    <p key={index} className={`mb-6 leading-relaxed text-lg text-gray-700 dark:text-gray-200 font-medium ${index === 0 ? 'first-letter:text-7xl first-letter:font-extrabold first-letter:text-transparent first-letter:bg-clip-text first-letter:bg-gradient-to-r first-letter:from-indigo-600 first-letter:to-cyan-500 first-letter:float-left first-letter:mr-3 first-letter:-mt-2' : ''}`}>
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Author & Share */}
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-700/60 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 dark:text-white tracking-tight text-lg">{post.author}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Editor & CA Mentor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-2">Share:</span>
                  {[
                    { icon: <HiOutlineLink className="w-5 h-5" />, title: "Copy Link" },
                    { icon: <HiOutlineShare className="w-5 h-5" />, title: "Share" },
                  ].map((btn, i) => (
                    <button key={i} className="group/btn relative" title={btn.title}>
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity blur-sm"></div>
                      <div className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-gray-200 dark:border-gray-700/60">
                        {btn.icon}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Related <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Articles</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(related => (
              <div key={related.id} className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl shadow-md group-hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group-hover:-translate-y-1">
                  <Link to={`/blog/${related.id}`} className="h-44 w-full relative block overflow-hidden">
                    <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-extrabold text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                      <Link to={`/blog/${related.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">{related.title}</Link>
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      {related.date}
                    </p>
                    <Link to={`/blog/${related.id}`} className="mt-auto text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group/link inline-flex items-center gap-1">
                      Read More <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
