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
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-800/50 shadow-sm relative overflow-hidden h-full">
      <div className="absolute -right-4 -top-4 opacity-10 transform rotate-12 pointer-events-none">
        <HiLightningBolt className="w-32 h-32 text-yellow-500" />
      </div>
      
      <div className="relative z-10 flex flex-col justify-center h-full">
        <div className="flex items-center gap-2 mb-3">
          <HiLightningBolt className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 uppercase tracking-wider">
            Quote of the Day
          </h3>
        </div>
        
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
          "{todaysQuote}"
        </p>
      </div>
    </div>
  );
};

export default DailyMotivator;
