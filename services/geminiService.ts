
import { GoogleGenAI, Type } from '@google/genai';
import { type Friend, type GiftSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key not found. Make sure to set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const giftSuggestionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'The name of the gift idea.',
      },
      reason: {
        type: Type.STRING,
        description: 'A brief explanation why this gift would be suitable for the person.',
      },
      estimated_price: {
        type: Type.STRING,
        description: 'A rough price range for the gift (e.g., "$20-30", "approx. $100").',
      },
    },
    required: ['name', 'reason', 'estimated_price'],
  },
};

export const generateGiftSuggestions = async (friend: Friend): Promise<GiftSuggestion[]> => {
  try {
    const prompt = `
      Based on the following information about my friend, please suggest 5 unique and thoughtful gift ideas in German.
      - Name: ${friend.name}
      - Hobbies: ${friend.hobbies}
      - Favorite Color: ${friend.favorite_color}
      - Favorite Food: ${friend.favorite_food}
      - Additional Notes: ${friend.notes}

      Provide the response as a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: giftSuggestionSchema,
      },
    });

    const jsonString = response.text.trim();
    const suggestions: GiftSuggestion[] = JSON.parse(jsonString);
    return suggestions;
  } catch (error) {
    console.error('Error generating gift suggestions:', error);
    throw new Error('Could not generate gift suggestions. Please try again.');
  }
};
