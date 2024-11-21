// ----- Google sheets
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');
const path = require('path');

// Load service account key file

const KEYFILEPATH = path.join(__dirname, 'portfolio-visitor-count-439e47ae1fe3.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1Acx3JX-oR8zTptu9d_kr6j3sNBAS3sAkepJDxAGHD9w/edit?gid=0#gid=0'; // Copy this from the URL of the sheet
const RANGE = 'Sheet1!B1'; // Adjust for where your counter is stored

async function incrementCounter() {
    const authClient = await auth.getClient();

    // Get the current value
    const getResponse = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    });

    let counter = parseInt(getResponse.data.values[0][0] || '0', 10);

    // Increment the counter
    counter++;

    // Update the value in the sheet
    await sheets.spreadsheets.values.update({
        auth: authClient,
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        requestBody: {
            values: [[counter]],
        },
    });

    console.log(`Updated counter: ${counter}`);
    return counter;
}

incrementCounter().catch(console.error);

// -----

const express = require('express');
const app = express();

app.get('/counter', async (req, res) => {
    try {
        const counter = await incrementCounter();
        res.send(counter.toString());
    } catch (error) {
        res.status(500).send('Error updating counter');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});