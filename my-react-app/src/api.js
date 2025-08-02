import axios from "axios";

const API_URL = "http://localhost:3000/query"; //  backend endpoint

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data; // Expected: { answer: "Your response from backend" }
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Failed to fetch answer." };
  }
};