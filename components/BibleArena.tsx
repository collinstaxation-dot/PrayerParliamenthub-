
import React, { useState, useRef, useEffect } from 'react';
import { searchBibleArena } from '../services/geminiService';
import { Icons, BIBLE_TRANSLATIONS } from '../constants';

const BibleArena: React.FC = () => {
  const [query, setQuery] = useState('');
  const [translation, setTranslation] = useState('KJV');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await searchBibleArena(query, translation);
      setResult(response.text);
    } catch (err) {
      setResult("Archive gates connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-8 lg:p-12 scrollbar-none">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full border border-amber-500/20 mx-auto">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            PPHub Bible Arena
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none">
            Sanctuary of <br /><span className="text-amber-500">Truth.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto">
            Deep scriptural study aligned with PWO methodology.
          </p>
        </header>

        <section className="bg-slate-900/40 border border-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Topic or Verse Reference</label>
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Generational curses, Psalm 91..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 text-base md:text-lg text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Translation</label>
                <div className="flex flex-wrap gap-2">
                  {BIBLE_TRANSLATIONS.map(v => (
                    <button 
                      key={v}
                      type="button"
                      onClick={() => setTranslation(v)}
                      className={`px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase transition-all border ${
                        translation === v 
                          ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                          : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 py-5 rounded-2xl font-black text-lg text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Open the Scrolls"}
              </button>
            </div>
          </form>
        </section>

        {result && (
          <section ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
            <div className="bg-slate-900/40 border border-amber-500/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-14 backdrop-blur-xl shadow-3xl">
              <div className="flex items-center gap-4 mb-8 border-b border-slate-800/50 pb-6">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Icons.Book /></div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Arena Insights</h3>
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Translation: {translation}</p>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-base md:text-lg lg:text-xl selection:bg-amber-500/30">
                {result}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BibleArena;
