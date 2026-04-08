import React, { useMemo } from 'react';
import { HiLightningBolt } from 'react-icons/hi';

const QUOTES = [
  "Success is not final, failure is not fatal.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Push yourself, because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Education is the passport to the future.",
  "CA is not just a degree, it's a testament to your hard work.",
  "Stay focused, stay determined, and let your success make the noise.",
  "The expert in anything was once a beginner.",
  "You don't have to be great to start, but you have to start to be great.",
  "Believe you can and you're halfway there.",
  "Strive for progress, not perfection."
];

const DailyMotivator = () => {
  const todaysQuote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  return (
    <div className="group relative rounded-3xl p-8 shadow-2xl shadow-pink-500/10 overflow-hidden h-full flex flex-col justify-center transition-all duration-300 hover:shadow-orange-500/20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 dark:from-orange-600 dark:via-rose-700 dark:to-purple-800"></div>
      
      {/* Dark overlay for contrast & subtle noise */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px]"></div>
      
      {/* Decorative Icon abstract */}
      <div className="absolute -right-8 -top-8 mix-blend-overlay opacity-40 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
        <HiLightningBolt className="w-56 h-56 text-white" />
      </div>
      
      <div className="relative z-10 flex flex-col justify-center h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/20">
            <HiLightningBolt className="w-5 h-5 text-yellow-300" />
          </div>
          <h3 className="text-xs font-extrabold text-white/90 uppercase tracking-[0.2em] drop-shadow-md">
            Daily Motivation
          </h3>
        </div>
        
        <p className="text-xl md:text-2xl font-serif font-medium text-white leading-relaxed drop-shadow-lg max-w-3xl">
          "{todaysQuote}"
        </p>
      </div>
    </div>
  );
};

export default DailyMotivator;
