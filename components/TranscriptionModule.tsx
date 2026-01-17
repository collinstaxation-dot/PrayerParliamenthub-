
import React, { useState } from 'react';
import { transcribeAudio } from '../services/geminiService';

const TranscriptionModule: React.FC = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [text, setText] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const result = await transcribeAudio(base64);
        setText(result);
        setIsTranscribing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsTranscribing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Sermon Transcriber</h2>
        <p className="text-slate-400 text-sm mb-6">Convert audio recordings of teachings into text instantly.</p>
        
        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-indigo-500 transition-colors">
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange}
            className="hidden" 
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer group flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-lg font-bold">Select Audio File</span>
            <span className="text-xs text-slate-500 mt-2">MP3, WAV, M4A supported</span>
          </label>
        </div>
      </div>

      {isTranscribing && (
        <div className="text-center p-8">
           <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
           <p className="text-slate-400 font-medium">Processing audio with Gemini Flash...</p>
        </div>
      )}

      {text && (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Transcription</h3>
            <button 
              onClick={() => navigator.clipboard.writeText(text)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest"
            >
              Copy Text
            </button>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl text-slate-300 text-sm leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionModule;
