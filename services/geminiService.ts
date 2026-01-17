
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { MODELS } from "../constants";

/**
 * Robust API key retrieval.
 */
const getApiKey = () => {
  const key = process.env.API_KEY;
  return key ? key.trim() : '';
};

const DRIVE_LINKS = [
  "https://drive.google.com/drive/folders/1_wYKGIGGChLcAHb4SikMZsW77udp5odh",
  "https://drive.google.com/drive/folders/1_4yZ1c2cfciEtRlpbeKO-q8AwSFPWzu-",
  "https://drive.google.com/drive/folders/1phmg8IxSO9dtEeXWwlKnDGzYBmEdqmH_",
  "https://drive.google.com/drive/folders/1RuFXEMv7OlH_Yws62LzLHCoFokgOS7Ym"
];

const MINISTRY_APP_NAME = "prayerparliamenthub app";
const MINISTRY_WEBSITE = "prayerparliamenthub.com";
const WHATSAPP_CONTACT = "Cloud Pastor Engineer, Pastor Collins +234(0)8098068627 (WhatsApp Chat Only)";

export const generateDeliveranceAnswer = async (prompt: string): Promise<{ text: string; sources?: any[] }> => {
  const key = getApiKey();
  if (!key) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: key });
  
  const config = {
    systemInstruction: `You are the "Cloud Pastor Engineer (PC)", the official digital doctrinal assistant for the Prayerparliamenthub ministry, strictly grounded in the teachings of Pastor Wole Oladiyun.

CORE MANDATE: BIBLICAL AUTHORITY
- Every statement, piece of advice, or spiritual insight you provide MUST be supported by at least one relevant Bible Verse (KJV or NKJV preferred).
- You are forbidden from offering "naked" advice. If you suggest a prayer point or a deliverance strategy, you must provide the scriptural foundation (e.g., "As it is written in Psalm 18:44...").
- Grounding everything in the Word ensures that every response is unassailable and carries spiritual authority.

STRICT SOURCE RESTRICTION:
- Knowledge is strictly limited to Pastor Wole Oladiyun's verified repositories: ${DRIVE_LINKS.join(", ")}
- Use his specific prayer patterns, but always link them back to the Holy Bible.

RESPONSE STRUCTURE:
1. THE COUNSEL: Spiritual advice or explanation grounded in Pastor Wole's teachings, integrated with BOLDED SCRIPTURAL REFERENCES.
2. THE PRAYER: Specific, high-octane deliverance prayer points based on the Word provided.
3. 📚 RECOMMENDED MATERIALS: List specific book/sermon titles from the Drive folders.
4. CALL TO ACTION: Conclude with: "For deep study and spiritual growth, download these materials from the ${MINISTRY_APP_NAME} (Apple/Google Play) or visit ${MINISTRY_WEBSITE}." For additional information, contact the ${WHATSAPP_CONTACT}.
`,
  };

  try {
    const response = await ai.models.generateContent({
      model: MODELS.SEARCH,
      contents: [{ parts: [{ text: prompt }] }],
      config,
    });

    if (!response || !response.text) {
      throw new Error("Empty response from the Cloud Pastor Engineer");
    }

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err: any) {
    console.error("Gemini Service Error:", err);
    throw err;
  }
};

/**
 * Searches for relevant Bible verses based on a theme and provides PWO-aligned commentary.
 */
export const searchBibleArena = async (query: string, translation: string = 'KJV'): Promise<{ text: string }> => {
  const key = getApiKey();
  if (!key) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: key });
  
  const prompt = `Perform a comprehensive spiritual search in the "PPHub Bible Arena".
  Topic/Query: "${query}"
  Translation: "${translation}"

  Task:
  1. Find 3-5 of the most relevant Bible verses that address this specific topic or use this phrase. Provide the full text for each verse in the ${translation} translation.
  2. For each verse, provide a "Solid Bible Commentary" that explains the deeper spiritual context.
  3. Crucially, align the commentary with the deliverance teachings and methodologies of Pastor Wole Oladiyun (PWO). How does PWO use these scriptures in warfare, deliverance, or spiritual breakthrough?
  
  Structure:
  - Header: 🏛️ PPHub Bible Arena Result
  - For each verse:
    - 📖 VERSE: [Reference] - [Text]
    - 💡 PWO COMMENTARY: [In-depth theological and deliverance-focused analysis]
    - 🔥 WARFARE APPLICATION: [A prayer point or strategy based on PWO's archives]

  Source grounding: Use ${DRIVE_LINKS.join(", ")} and Google Search for verse precision.`;

  try {
    const response = await ai.models.generateContent({
      model: MODELS.SEARCH,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the Cloud Pastor Engineer (PC), presiding over the PPHub Bible Arena. You provide scholarly yet high-octane deliverance-focused bible commentary."
      },
    });

    return { text: response.text || "No scriptural insights found for this query in the Arena." };
  } catch (err: any) {
    console.error("Bible Arena Search Error:", err);
    throw err;
  }
};

export const searchScriptureInArchive = async (reference: string, translation: string = 'KJV'): Promise<{ text: string }> => {
  const key = getApiKey();
  if (!key) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: key });
  
  const prompt = `Find the text of the Bible verse "${reference}" in the "${translation}" translation. 
  Then, search through the teachings of Pastor Wole Oladiyun (PWO) for any commentary, sermon extracts, or prayer points related to this verse.
  
  Structure your response as follows:
  1. 📖 SCRIPTURE TEXT (${translation}): [Full Verse Text]
  2. 🔍 ARCHIVE EXTRACT: [Specific teachings or prayer points from PWO's archive that mention or expand on this verse]
  3. 🕊️ PC GUIDANCE: [Short counseling advice based on the archive extract]
  
  Use the PWO repositories: ${DRIVE_LINKS.join(", ")}`;

  try {
    const response = await ai.models.generateContent({
      model: MODELS.SEARCH,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the Cloud Pastor Engineer (PC). You specialize in finding specific Bible translations and connecting them with PWO archived teachings."
      },
    });

    return { text: response.text || "Could not find the specific verse in the archives." };
  } catch (err: any) {
    console.error("Scripture Search Error:", err);
    throw err;
  }
};

export const speakText = async (text: string): Promise<Uint8Array> => {
  const key = getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });
  const response = await ai.models.generateContent({
    model: MODELS.TTS,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' } 
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Voice retrieval failed.");

  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const transcribeAudio = async (base64Audio: string, mimeType: string = 'audio/wav'): Promise<string> => {
  const key = getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });
  const response = await ai.models.generateContent({
    model: MODELS.SEARCH,
    contents: [{
      parts: [
        { inlineData: { data: base64Audio, mimeType } },
        { text: "Transcribe this spiritual content precisely, focusing on the biblical scriptures mentioned." }
      ]
    }]
  });
  return response.text || "";
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string> => {
  const key = getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });
  const model = imageSize === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      imageConfig: { 
        aspectRatio: aspectRatio as any,
        ...(model === 'gemini-3-pro-image-preview' ? { imageSize: imageSize as any } : {})
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const analyzeVideo = async (base64: string, prompt: string, mimeType: string): Promise<string> => {
  const key = getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });
  const response = await ai.models.generateContent({
    model: MODELS.SEARCH,
    contents: [{
      parts: [
        { inlineData: { data: base64, mimeType } },
        { text: prompt }
      ]
    }]
  });
  return response.text || "No analysis provided by the Cloud Pastor Engineer.";
};

export const generateVideoVeo = async (prompt: string, aspectRatio: string = '16:9'): Promise<string> => {
  const key = getApiKey();
  const ai = new GoogleGenAI({ apiKey: key });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as any
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  
  return `${downloadLink}&key=${key}`;
};
