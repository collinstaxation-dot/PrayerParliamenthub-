
import React, { useState } from 'react';
import { analyzeVideo } from '../services/geminiService';

const MediaAnalysisModule: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('Analyze this spiritual content. Summarize key prayer points and spiritual insights.');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fullData = e.target?.result as string;
        // Correctly extracting MIME type from data URL
        const mimeType = fullData.split(';')[0].split(':')[1];
        const base64 = fullData.split(',')[1];
        const response = await analyzeVideo(base64, prompt, mimeType);
        setResult(response);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Media Insight Lab</h2>
        <p className="text-slate-400 text-sm mb-6">Extract spiritual breakthroughs from sermons or testimonies.</p>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors">
            <input 
              type="file" 
              accept="video/mp4,image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden" 
              id="media-upload"
            />
            <label htmlFor="media-upload" className="cursor-pointer group">
              <div className="bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-sm font-medium">{file ? file.name : "Choose video or image file"}</span>
            </label>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
            placeholder="What should the AI look for?"
          />

          <button 
            disabled={!file || isLoading}
            onClick={handleAnalyze}
            className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
              isLoading ? 'bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isLoading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Deeply...</>
            ) : "Extract Insights"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
            <h3 className="font-bold text-lg">Extraction Result</h3>
            <button onClick={() => setResult('')} className="text-slate-500 hover:text-white text-xs">Clear</button>
          </div>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAnalysisModule;
