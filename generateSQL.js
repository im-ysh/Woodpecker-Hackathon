
// generateSQL.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function generateSQL(userQuery) {
  const prompt = `
Convert the following natural language question into a MySQL query for a car sales database.

Database schema information:
- Tables: customers, cars, sales, employees
- customers: id, name, country, email
- cars: id, model, brand, year, price
- sales: id, customer_id, car_id, employee_id, sale_date, price
- employees: id, name, position

Natural Language: "${userQuery}"

Return ONLY the SQL query without any explanations or markdown formatting.
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

    const generated = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Clean up the response
    return generated.trim()
      .replace(/^```sql/, '')
      .replace(/```$/, '')
      .trim();
  } catch (error) {
    console.error('Error from Gemini API:', error.response?.data || error.message);
    throw new Error(`Error generating SQL: ${error.message}`);
  }
}