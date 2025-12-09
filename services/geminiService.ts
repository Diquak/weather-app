import { GoogleGenAI } from "@google/genai";
import { WeatherData, City } from "../types";
import { getWeatherDescription } from "./weatherService";

export const getOutfitSuggestion = async (
  city: City,
  weather: WeatherData
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Unable to fetch AI suggestion.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const condition = getWeatherDescription(weather.current.weatherCode);
    const temp = `${weather.current.temp}${weather.units.temp}`;
    const wind = `${weather.current.windSpeed}${weather.units.speed}`;
    
    const prompt = `
      I am in ${city.name}. 
      The weather is currently ${condition} with a temperature of ${temp}.
      Humidity is ${weather.current.humidity}% and wind speed is ${wind}.
      Precipitation probability is ${weather.current.precipitationProb}%.
      
      Give me a short, stylish, and practical outfit suggestion (max 50 words). 
      Format the response as plain text. 
      Focus on the "Vibe" of the outfit.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Wear something comfortable!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not connect to the fashion stylist AI right now. Please try again later.";
  }
};
