const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());


// Load service account credentials

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
console.log(`key json: ${credentials}`);
// Authenticate with Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
console.log(`spreadsheet ID: ${SPREADSHEET_ID}`);
const RANGE = 'Sheet1!B1'; // Adjust to your target cell

// API endpoint to increment and return value
app.get('/counter', async (req, res) => {
  try {
    // Read current value
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const currentValue = parseInt(getResponse.data.values?.[0]?.[0] || '0', 10);

    // Increment value
    const newValue = currentValue + 1;

    // Update the cell with the new value
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[newValue]],
      },
    });

    res.send(newValue.toString());
  } catch (error) 
  {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
