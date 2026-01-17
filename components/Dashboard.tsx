
import React from 'react';
import { AppView } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const trendingQueries = [
    "Prayers for breaking foundational curses",
    "Spiritual warfare for career breakthrough",
    "Deliverance from spirit husband/wife",
    "Prayers against mid-night atmospheric battles"
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-none px-4 sm:px-8 lg:px-12 py-8 md:py-16 lg:py-24 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto space-y-16 lg:space-y-32">
        
        {/* Responsive Hero Section */}
        <section className="text-center space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-indigo-500/20 mx-auto shadow-lg shadow-indigo-500/5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Official PPHub Cloud Pastor Engineer
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
            Spiritual Wisdom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600">
              via PC Oracle.
            </span>
          </h2>
          
          <p className="text-slate-400 text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium px-4">
            Access thousands of archived deliverance teachings in real-time. Grounded exclusively in the verified methodology of Pastor Wole Oladiyun.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-4">
            <button 
              onClick={() => onNavigate(AppView.CHAT)}
              className="w-full sm:w-auto group relative bg-indigo-600 hover:bg-indigo-500 px-8 lg:px-12 py-5 lg:py-6 rounded-2xl font-black text-lg lg:text-xl transition-all shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                Counseling Session <Icons.Chat />
              </div>
            </button>
            <a 
              href="https://prayerparliamenthub.com" 
              target="_blank"
              className="w-full sm:w-auto bg-slate-800 border border-slate-700 hover:bg-slate-750 px-8 lg:px-12 py-5 lg:py-6 rounded-2xl font-black text-lg lg:text-xl transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95"
            >
              Learn More <Icons.External />
            </a>
          </div>
        </section>

        {/* Adaptive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card 
            title="Teaching Archive" 
            description="Query archived deliverance materials strictly from Pastor Wole Oladiyun. Get biblical answers with instant scriptural proof."
            icon={<Icons.Chat />}
            onClick={() => onNavigate(AppView.CHAT)}
            tag="PC Archive"
          />
          <Card 
            title="Bible Arena" 
            description="A high-octane study sanctuary with deep commentary. Search phrases and get PWO-aligned spiritual breakdowns."
            icon={<Icons.Book />}
            onClick={() => onNavigate(AppView.BIBLE_ARENA)}
            tag="Study Lab"
          />
          
          {/* Trending Card with responsive internal layout */}
          <div className="md:col-span-2 lg:col-span-1 group bg-slate-900/40 p-8 lg:p-10 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col h-full backdrop-blur-sm">
            <div className="flex justify-between items-start mb-8 lg:mb-10">
              <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icons.Live />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                Trending
              </span>
            </div>
            <h3 className="text-xl lg:text-2xl font-black mb-3 tracking-tight">Most Searched</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-6 font-medium">
              Common spiritual queries from the archive.
            </p>
            <div className="space-y-2 lg:space-y-3 flex-1 overflow-y-auto max-h-[250px] lg:max-h-none scrollbar-none">
              {trendingQueries.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => onNavigate(AppView.CHAT)}
                  className="w-full p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 text-[10px] lg:text-[11px] text-left font-bold text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all flex justify-between items-center group/item"
                >
                  <span className="truncate pr-2">{q}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-20 border-t border-slate-900 pb-10">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Ministry Cloud Deployment</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[8px] md:text-[10px] font-black text-slate-700 uppercase">
            <span>© 2025 PRAYERPARLIAMENTHUB</span>
            <span className="hidden sm:inline">•</span>
            <span>PWO DOCTRINE</span>
            <span className="hidden sm:inline">•</span>
            <span>CLOUD PASTOR ENGINEER v2.1</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const Card: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  onClick: () => void;
  tag: string;
}> = ({ title, description, icon, onClick, tag }) => (
  <button 
    onClick={onClick}
    className="group bg-slate-900/40 p-8 lg:p-10 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/30 transition-all text-left flex flex-col h-full backdrop-blur-sm"
  >
    <div className="flex justify-between items-start mb-8 lg:mb-10">
      <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
        {tag}
      </span>
    </div>
    <h3 className="text-xl lg:text-2xl font-black mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-slate-500 text-xs lg:text-sm leading-relaxed flex-1 font-medium opacity-80">
      {description}
    </p>
  </button>
);

export default Dashboard;
