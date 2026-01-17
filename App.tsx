
import React, { useState } from 'react';
import { AppView } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import ChatModule from './components/ChatModule';
import BibleArena from './components/BibleArena';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD: return <Dashboard onNavigate={setActiveView} />;
      case AppView.CHAT: return <ChatModule />;
      case AppView.BIBLE_ARENA: return <BibleArena />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Premium Adaptive Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shrink-0 z-50">
        <div 
          className="flex items-center space-x-3 md:space-x-4 cursor-pointer group"
          onClick={() => setActiveView(AppView.DASHBOARD)}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-sm md:text-xl font-black text-white">PC</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm lg:text-base font-black tracking-widest uppercase text-white leading-none">Cloud Pastor Engineer</h1>
            <span className="text-[7px] md:text-[9px] text-indigo-400 font-bold uppercase tracking-widest opacity-70 mt-1">PPHub Oracle</span>
          </div>
        </div>

        {/* Desktop/iPad Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.25em]">
          <button 
            onClick={() => setActiveView(AppView.DASHBOARD)} 
            className={`transition-all hover:text-white ${activeView === AppView.DASHBOARD ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveView(AppView.CHAT)} 
            className={`transition-all hover:text-white ${activeView === AppView.CHAT ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500'}`}
          >
            Counseling
          </button>
          <button 
            onClick={() => setActiveView(AppView.BIBLE_ARENA)} 
            className={`transition-all hover:text-white ${activeView === AppView.BIBLE_ARENA ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500'}`}
          >
            Bible Arena
          </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <a 
            href="https://prayerparliamenthub.com" 
            target="_blank" 
            className="hidden sm:inline-block bg-indigo-600 hover:bg-indigo-500 px-4 md:px-5 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Main Site
          </a>
          <div className="md:hidden">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]" />
          </div>
        </div>
      </header>

      {/* Responsive Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-[radial-gradient(circle_at_top,_rgba(30,27,75,0.2),_transparent)]">
        <div className="h-full w-full max-w-screen-2xl mx-auto flex flex-col">
          {renderView()}
        </div>
      </main>

      {/* Adaptive Mobile Bottom Navigation */}
      <footer className="md:hidden bg-slate-900 border-t border-slate-800/50 flex justify-around items-center py-4 px-2 shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-pb">
        <button 
          onClick={() => setActiveView(AppView.DASHBOARD)} 
          className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.DASHBOARD ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => setActiveView(AppView.CHAT)} 
          className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.CHAT ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Icons.Chat />
          <span className="text-[8px] font-black uppercase tracking-tighter">PC Chat</span>
        </button>
        <button 
          onClick={() => setActiveView(AppView.BIBLE_ARENA)} 
          className={`flex flex-col items-center gap-1 transition-all ${activeView === AppView.BIBLE_ARENA ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Icons.Book />
          <span className="text-[8px] font-black uppercase tracking-tighter">Arena</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
