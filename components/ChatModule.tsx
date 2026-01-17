
import React, { useState, useRef, useEffect } from 'react';
import { generateDeliveranceAnswer, speakText, transcribeAudio, searchScriptureInArchive } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Icons, BIBLE_TRANSLATIONS } from '../constants';

const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [bibleSearch, setBibleSearch] = useState('');
  const [bibleVersion, setBibleVersion] = useState('KJV');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (autoVoice && lastMessage?.role === 'model' && !isLoading) {
      playTTS(lastMessage.text);
    }
  }, [messages, autoVoice, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'system',
        text: "Cloud Pastor Engineer (PC) Active. Every response is anchored in the Holy Scriptures and the teachings of Pastor Wole Oladiyun. Use the search bar above for archive verification.",
        timestamp: Date.now()
      }]);
    }
  }, []);

  const handleBibleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bibleSearch.trim() || isLoading) return;
    
    const query = `${bibleSearch} (${bibleVersion})`;
    setMessages(prev => [...prev, { role: 'user', text: `Verifying Archive: ${query}`, timestamp: Date.now() }]);
    setBibleSearch('');
    setIsLoading(true);
    
    try {
      const result = await searchScriptureInArchive(bibleSearch, bibleVersion);
      setMessages(prev => [...prev, {
        role: 'model',
        text: result.text,
        timestamp: Date.now()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', text: "Archive search timeout.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const messageText = customText || input;
    if (!messageText.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await generateDeliveranceAnswer(messageText);
      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        sources: response.sources
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'system', text: "Connection error.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    if (isPlaying) {
      currentSourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBytes = await speakText(text);
      const buffer = audioCtxRef.current.createBuffer(1, audioBytes.length / 2, 24000);
      const dataInt16 = new Int16Array(audioBytes.buffer);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsPlaying(false);
      currentSourceRef.current = source;
      source.start();
    } catch (err) {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      
      {/* Responsive Archive Search Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 shrink-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleBibleSearch} className="flex-1 flex gap-2">
            <input 
              value={bibleSearch}
              onChange={(e) => setBibleSearch(e.target.value)}
              placeholder="Archive search (e.g. Psalm 35:1)"
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-xs md:text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <select 
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-[10px] md:text-xs text-indigo-400 font-bold uppercase outline-none"
            >
              {BIBLE_TRANSLATIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Search
            </button>
          </form>
          <div className="hidden sm:flex items-center gap-2 px-4 border-l border-slate-800">
             <button 
               onClick={() => setAutoVoice(!autoVoice)}
               className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${autoVoice ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
             >
               Voice: {autoVoice ? 'ON' : 'OFF'}
             </button>
          </div>
        </div>
      </div>

      {/* Messages Area with constrained width for readability */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-none">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-5 md:p-7 rounded-3xl shadow-xl ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
                  : m.role === 'system'
                  ? 'bg-indigo-950/20 text-indigo-400 text-[10px] font-bold text-center mx-auto px-8 py-2 rounded-full border border-indigo-500/20 uppercase tracking-widest'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-sm'
              }`}>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {m.text}
                </div>
                {m.role === 'model' && (
                  <button 
                    onClick={() => playTTS(m.text)} 
                    className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isPlaying ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-300'}`}
                  >
                    <Icons.Live /> {isPlaying ? "Stop Voice" : "Narration"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/60 px-6 py-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Oracle Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-900/50 safe-area-pb">
        <form onSubmit={(e) => handleSend(e)} className="max-w-4xl mx-auto flex items-center gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type query..."
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm md:text-base text-white focus:ring-1 focus:ring-indigo-600 outline-none placeholder:text-slate-700"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 p-4 rounded-2xl transition-all shadow-lg active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModule;
