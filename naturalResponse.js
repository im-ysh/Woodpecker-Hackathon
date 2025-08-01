// naturalResponse.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function generateNaturalResponse(question, data) {
  const prompt = `
Convert the following database query results into a natural language answer for the original question.

Original Question: "${question}"
Query Results: ${JSON.stringify(data)}

Provide a concise, human-readable answer in complete sentences. 
Don't mention the query or database structure.
`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GEMINI_API_KEY
        }
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "Here's the information you requested: " + JSON.stringify(data);
  } catch (error) {
    console.error('Error generating natural response:', error);
    return "Here are the results: " + JSON.stringify(data);
  }
}