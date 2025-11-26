import { GoogleGenAI, Type } from "@google/genai";
import { LoadingStatus, TabState, MessagePayload, ScrapeResponse, FloodRescueData } from './types';

// Fix: Add declaration for chrome namespace to resolve type errors
declare const chrome: any;

// NOTE: In a real extension, this should be handled via a secure build process or user input options.
const API_KEY = process.env.API_KEY || ''; 

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Flood Rescue Scout installed.");
  if (!API_KEY) {
    console.warn("⚠️ API Key is missing! Please set GEMINI_API_KEY in .env.local and rebuild.");
  } else {
    console.log("✅ API Key configured (length:", API_KEY.length, "chars)");
  }
});

// Message Listener
chrome.runtime.onMessage.addListener((message: MessagePayload, sender: any, sendResponse: any) => {
  if (message.action === 'ANALYZE_REQUEST') {
    const tabId = sender.tab?.id;
    
    // If sent from popup, sender.tab might be undefined, so we query active tab
    if (!tabId) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (tabs[0]?.id) {
          processTab(tabs[0].id);
        }
      });
    } else {
      processTab(tabId);
    }
  }
});

async function processTab(tabId: number) {
  // 1. Set Loading State
  await updateState(tabId, { status: LoadingStatus.LOADING, data: null, error: null });

  try {
    // 2. Scrape Content
    // We ensure the content script is alive by sending a message. 
    // If it fails, we assume it's not injected or refreshed, so we might need to rely on the manifest injection.
    // Given the manifest defines content_scripts, it should be there.
    let text = "";
    
    try {
        const response = await chrome.tabs.sendMessage(tabId, { action: 'SCRAPE_TEXT' }) as ScrapeResponse;
        text = response.text;
    } catch (e) {
        // Fallback: If content script isn't ready, try creating a script execution
        // This handles cases where the extension was installed after the page loaded
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js']
        });
        
        // After injection, try messaging again
        const response = await chrome.tabs.sendMessage(tabId, { action: 'SCRAPE_TEXT' }) as ScrapeResponse;
        text = response.text;
    }

    if (!text || text.length < 10) {
      throw new Error("Could not find enough text content on this page to analyze.");
    }

    // 3. Call Gemini API for NER
    const extractedData = await extractFloodRescueData(text);

    // 4. Save Success State
    await updateState(tabId, {
      status: LoadingStatus.SUCCESS,
      data: {
        ...extractedData,
        lastUpdated: Date.now()
      },
      error: null
    });

  } catch (error: any) {
    console.error("Processing Error:", error);
    await updateState(tabId, {
      status: LoadingStatus.ERROR,
      data: null,
      error: error.message || "Failed to extract flood rescue data."
    });
  }
}

async function updateState(tabId: number, newState: TabState) {
  await chrome.storage.local.set({ [tabId.toString()]: newState });
}

async function extractFloodRescueData(contextText: string): Promise<Omit<FloodRescueData, 'lastUpdated'>> {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please configure GEMINI_API_KEY in .env.local and rebuild.");
  }

  const prompt = `
    You are a Named Entity Recognition (NER) system specialized in extracting flood rescue information from social media posts.
    
    Analyze the following social media post text (which may include both the main post AND comments):
    "${contextText}"

    IMPORTANT: Extract information from BOTH the main post AND any comments section. Comments often contain crucial details like locations, contact information, and specific needs.

    Extract the following information:
    1. **location**: The address, village, district, city, or GPS coordinates mentioned in the text (check both post and comments). Look for:
       - Thai addresses (e.g., "72/8 หมู่ที่ 1 ซอยสำราญสุข สะพายดำ ตำบลคลองแห อำเภอหาดใหญ่ จังหวัดสงขลา")
       - GPS coordinates or location links
       - Landmarks or specific locations
       If no location is found, return "Not specified".
    
    2. **contact**: Phone numbers, names of contact persons, or social media handles (check both post and comments). Look for:
       - Phone numbers (Thai format: 08X-XXX-XXXX or international format)
       - Names mentioned as contact persons
       - Social media handles or usernames
       If no contact is found, return "Not specified".
    
    3. **severity**: Analyze the urgency level based on the content:
       - "Critical": Life-threatening situations, medical emergencies, elderly/sick people in danger, children in danger, people trapped in rising water
       - "High": People stuck, no food/water, urgent evacuation needed, immediate help required, water level rising
       - "Normal": General requests for help, non-urgent situations, preventive measures
       If severity cannot be determined, default to "Normal".
    
    4. **needs**: A brief summary of what they need (e.g., "Boat", "Food", "Evacuation", "Medical help", "Water", "Rescue"). Keep it concise (max 50 characters). If no specific needs mentioned, return "General help".
    
    5. **timestamp_context**: Any mention of time in the text (e.g., "posted 1 hour ago", "10:00 AM", "yesterday", "since morning", "ตอนนี้", "เมื่อสักครู่"). If no time context is found, return "Not specified".
    
    6. **number_of_people**: The number of people mentioned who need help (e.g., "5 people", "ครอบครัว 4 คน", "ประมาณ 10 คน"). If no number is mentioned, return "Not specified".
    
    7. **weather_condition**: Current weather conditions mentioned (e.g., "heavy rain", "ฝนตกหนัก", "still raining", "water rising", "น้ำขึ้น"). If no weather condition is mentioned, return "Not specified".
    
    8. **additional_info**: Any other important information that doesn't fit in the above categories (e.g., special medical conditions, accessibility needs, building type, floor level, etc.). Keep it concise (max 100 characters). If no additional info, return "None".

    Return the data as a strict JSON object matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
            contact: { type: Type.STRING },
            severity: { 
              type: Type.STRING,
              enum: ['Critical', 'High', 'Normal']
            },
            needs: { type: Type.STRING },
            timestamp_context: { type: Type.STRING },
            number_of_people: { type: Type.STRING },
            weather_condition: { type: Type.STRING },
            additional_info: { type: Type.STRING }
          },
          required: ['location', 'contact', 'severity', 'needs', 'timestamp_context', 'number_of_people', 'weather_condition', 'additional_info']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (
        parsed &&
        typeof parsed.location === 'string' &&
        typeof parsed.contact === 'string' &&
        ['Critical', 'High', 'Normal'].includes(parsed.severity) &&
        typeof parsed.needs === 'string' &&
        typeof parsed.timestamp_context === 'string' &&
        typeof parsed.number_of_people === 'string' &&
        typeof parsed.weather_condition === 'string' &&
        typeof parsed.additional_info === 'string'
      ) {
        return parsed;
      }
    }
    throw new Error("Invalid response format from AI.");
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    
    // Provide more detailed error messages
    if (err?.message) {
      const errorMsg = err.message.toLowerCase();
      if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
        throw new Error("Gemini API quota exceeded. Please check your usage limits or try again later.");
      } else if (errorMsg.includes('api key') || errorMsg.includes('authentication') || errorMsg.includes('401') || errorMsg.includes('403')) {
        throw new Error("Invalid API key. Please check your GEMINI_API_KEY in .env.local and rebuild.");
      } else if (errorMsg.includes('429')) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
    }
    
    throw new Error(`Failed to contact Gemini API: ${err?.message || 'Unknown error'}`);
  }
}