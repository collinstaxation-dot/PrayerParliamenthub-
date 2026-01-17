import React, { useState } from 'react';
import { generateImage, generateVideoVeo } from '../services/geminiService';

const GenerativeModule: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ url: string; type: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // GUIDELINE: When using Veo or Pro models, check for mandatory API key selection
    const isVeo = mediaType === 'video';
    const isProImage = mediaType === 'image' && (imageSize === '2K' || imageSize === '4K');
    
    if (isVeo || isProImage) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Proceeding as per the assumption rule to mitigate potential race conditions
      }
    }

    setIsLoading(true);
    try {
      if (mediaType === 'image') {
        // Fixed: generateImage now correctly accepts imageSize as the third argument
        const url = await generateImage(prompt, aspectRatio, imageSize);
        setResults(prev => [{ url, type: 'image' }, ...prev]);
      } else {
        const url = await generateVideoVeo(prompt, aspectRatio);
        setResults(prev => [{ url, type: 'video' }, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      // GUIDELINE: Reset key selection if the request fails due to missing billing/project
      if (err.message?.includes("Requested entity was not found")) {
        alert("A paid GCP project is required for this model. Please select an appropriate API key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Generation failed. Please ensure you have selected a valid API key with billing enabled.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configuration Sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
          <h2 className="text-xl font-bold">Gen Studio</h2>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Media Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setMediaType('image')}
                className={`p-2 rounded-lg text-sm font-medium border ${mediaType === 'image' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-700'}`}
              >
                Image (Imagen 4)
              </button>
              <button 
                onClick={() => setMediaType('video')}
                className={`p-2 rounded-lg text-sm font-medium border ${mediaType === 'video' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-700'}`}
              >
                Video (Veo 3)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Aspect Ratio</label>
            <select 
              value={aspectRatio} 
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm outline-none"
            >
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="4:3">4:3 Standard</option>
            </select>
          </div>

          {mediaType === 'image' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Resolution</label>
              <select 
                value={imageSize} 
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm outline-none"
              >
                <option value="1K">1K HD</option>
                <option value="2K">2K Super HD</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
          )}

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm h-32 outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Describe the spiritual scene..."
          />

          {(mediaType === 'video' || (mediaType === 'image' && imageSize !== '1K')) && (
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <p className="text-[10px] text-indigo-300 leading-tight">
                Note: Veo and High-Quality Image generation require a selected API key from a paid GCP project. 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1">Learn about billing</a>.
              </p>
            </div>
          )}

          <button 
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            {isLoading ? "Forging Media..." : "Generate Magic"}
          </button>
        </div>
      </div>

      {/* Gallery / Results */}
      <div className="lg:col-span-2 space-y-6">
        {results.length === 0 && !isLoading && (
          <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Your generated content will appear here.</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-slate-800/50 p-12 rounded-3xl border border-slate-700 flex flex-col items-center justify-center animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Generating masterpiece...</h3>
            <p className="text-slate-500 text-sm">This can take up to 2 minutes for high-quality video.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res, i) => (
            <div key={i} className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              {res.type === 'image' ? (
                <img src={res.url} alt="Generated" className="w-full h-auto object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <video src={res.url} controls className="w-full h-auto" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                 <a href={res.url} download={`gen-${i}`} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200">Download</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerativeModule;
