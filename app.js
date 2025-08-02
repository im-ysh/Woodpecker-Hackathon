
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
  // Import cors at the top
import { generateSQL } from './generateSQL.js';
import { executeQuery } from './db.js';
import { generateNaturalResponse } from './naturalResponse.js';

// Initialize dotenv first
dotenv.config();

// Then create express app
const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(cors());  // Now app is defined

// Test route
app.get('/', (req, res) => {
  res.send(`
    <h1>API is running! </h1>
    <p>Use POST /query to ask questions.</p>
  `);
});

// Main query endpoint
app.post('/query', async (req, res) => {
  const userQuery = req.body.question;
  const responseType = req.body.responseType || 'natural';

  try {
    const sql = await generateSQL(userQuery);
    console.log('Generated SQL:', sql);
    const result = await executeQuery(sql);
    
    if (responseType === 'natural') {
      const naturalResponse = await generateNaturalResponse(userQuery, result);
      res.json({ question: userQuery, answer: naturalResponse, sql });
    } else {
      res.json({ question: userQuery, result, sql });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Something went wrong', 
      details: error.message,
      sql: error.sql
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});