
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async assistTriage(symptoms: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise brevemente estes sintomas de um paciente que quer agendar UPA: "${symptoms}". 
        Diga apenas se é um caso adequado para UPA ou se deve ir imediatamente para uma Emergência Hospitalar (casos graves de vida ou morte). 
        Seja empático e curto. Não dê diagnóstico médico formal.`,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Não foi possível processar a assistência virtual no momento. Por favor, prossiga com o agendamento se julgar necessário.";
    }
  }
}

export const geminiService = new GeminiService();
