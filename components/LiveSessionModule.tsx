
import React, { useState, useRef, useEffect } from 'react';
// Correctly import GoogleGenAI and other types from the official SDK
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const LiveSessionModule: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<{role: string, text: string}[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manual encoding as per guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Manual decoding as per guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Audio decoding logic for raw PCM data
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Always use direct initialization with named parameter for API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are a warm, empathetic spiritual counselor. Provide biblically-based, uplifting deliverance advice.',
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlobData = encode(new Uint8Array(int16.buffer));
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: pcmBlobData, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Process the model's output audio bytes
            const base64EncodedAudioString = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), audioCtx);
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioCtx.destination);
              
              // Tracking end time for smooth playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
            }
            // Handle audio transcriptions
            if (msg.serverContent?.inputTranscription) {
              setTranscript(prev => [...prev, { role: 'You', text: msg.serverContent.inputTranscription?.text || "" }]);
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, { role: 'Counselor', text: msg.serverContent.outputTranscription?.text || "" }]);
            }
            // Handle interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
                sourcesRef.current.delete(s);
              });
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => console.debug("Live Error:", e),
          onclose: (e: any) => setIsActive(false)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert("Microphone access is required for live counseling.");
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-b from-slate-900 to-indigo-950/20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Real-time Counseling</h2>
        <p className="text-slate-400">Low-latency spiritual guidance through voice.</p>
      </div>

      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${isActive ? 'border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.5)] scale-110' : 'border-slate-700'}`}>
          <button 
            onClick={isActive ? stopSession : startSession}
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            {isActive ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
            )}
          </button>
        </div>
        {isActive && (
          <div className="absolute -inset-8 pointer-events-none opacity-20">
             <div className="w-full h-full bg-indigo-500 blur-3xl rounded-full animate-pulse" />
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6 h-64 overflow-y-auto space-y-2 text-sm scrollbar-thin">
        {transcript.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-600 italic">
            {isActive ? "Listening for your voice..." : "Transcript will appear here."}
          </div>
        )}
        {transcript.map((t, i) => (
          <div key={i} className="flex gap-2">
            <span className={`font-bold uppercase text-[10px] w-16 ${t.role === 'You' ? 'text-indigo-400' : 'text-emerald-400'}`}>{t.role}:</span>
            <span className="text-slate-300">{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSessionModule;
