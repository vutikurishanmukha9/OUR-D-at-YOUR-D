import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface MedicineRecommendation {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
}

export interface SymptomAnalysisResult {
    aiAnalysis: string;
    ayurvedicMedicines: MedicineRecommendation[];
    allopathicMedicines: MedicineRecommendation[];
    severity: 'mild' | 'moderate' | 'severe';
    seekEmergencyCare: boolean;
}

const SYMPTOM_ANALYSIS_PROMPT = `You are a healthcare AI assistant for an Indian healthcare app. Analyze the patient's symptoms and provide recommendations in BOTH Ayurvedic and Allopathic (modern medicine) approaches.

IMPORTANT DISCLAIMERS:
- This is for informational purposes only
- Always recommend consulting a real doctor for proper diagnosis
- If symptoms indicate emergency, clearly state to seek immediate medical attention

Patient Symptoms: {symptoms}

Please respond in the following JSON format ONLY (no markdown, no extra text):
{
  "aiAnalysis": "A brief 2-3 sentence analysis of the likely condition based on symptoms",
  "severity": "mild|moderate|severe",
  "seekEmergencyCare": true/false,
  "ayurvedicMedicines": [
    {
      "name": "Medicine name",
      "dosage": "Dosage amount",
      "timing": "When to take",
      "duration": "How long to take"
    }
  ],
  "allopathicMedicines": [
    {
      "name": "Medicine name",
      "dosage": "Dosage amount",
      "timing": "When to take",
      "duration": "How long to take"
    }
  ]
}

Provide 2-4 medicines for each type. Use common, safe medicines. For Ayurvedic, include traditional remedies like Tulsi, Ashwagandha, Triphala, etc. For Allopathic, use common OTC medicines when appropriate.`;

export async function analyzeSymptoms(symptoms: string): Promise<SymptomAnalysisResult> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = SYMPTOM_ANALYSIS_PROMPT.replace('{symptoms}', symptoms);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        }
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        // Parse the JSON response
        const analysisResult: SymptomAnalysisResult = JSON.parse(cleanedText);

        return analysisResult;
    } catch (error: any) {
        console.error('Gemini API Error:', error.message);

        // Return a fallback response if AI fails
        return {
            aiAnalysis: 'Unable to analyze symptoms at this time. Please consult a healthcare professional for proper diagnosis.',
            severity: 'moderate',
            seekEmergencyCare: false,
            ayurvedicMedicines: [
                {
                    name: 'Tulsi (Holy Basil) Tea',
                    dosage: '1 cup',
                    timing: 'Morning and evening',
                    duration: '3-5 days'
                },
                {
                    name: 'Ginger and Honey',
                    dosage: '1 teaspoon',
                    timing: 'After meals',
                    duration: '5 days'
                }
            ],
            allopathicMedicines: [
                {
                    name: 'Consult a Doctor',
                    dosage: 'N/A',
                    timing: 'As soon as possible',
                    duration: 'As prescribed'
                }
            ]
        };
    }
}

export async function testGeminiConnection(): Promise<boolean> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return false;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        await model.generateContent('Say "OK" if you can hear me.');
        return true;
    } catch (error) {
        console.error('Gemini connection test failed:', error);
        return false;
    }
}
