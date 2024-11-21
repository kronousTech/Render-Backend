const express = require('express');
const fs = require ('fs');
const app = express();

const PORT = 3000;
const COUNTER_FILE = 'portfolio_visitors_count.txt';

// Initialize counter
let counter = readCounter();

// Function to read the counter from the file
function readCounter() 
{
    try 
    {
      if (fs.existsSync(COUNTER_FILE)) 
      {
        const data = fs.readFileSync(COUNTER_FILE, 'utf-8');

        return parseInt(data, 10) || 0;
      } 
      else 
      {
        return 0;
      }
    } 
    catch (err) 
    {
      console.error('Error reading the counter file:', err);
      return 0;
    }
}

// Function to save the counter to the file
function saveCounter(value) {
    try {
      fs.writeFileSync(COUNTER_FILE, value.toString(), 'utf-8');
    } catch (err) {
      console.error('Error writing to the counter file:', err);
    }
}

// Endpoint to get the current count
app.get('/counter', (req, res) => {
    res.send(counter.toString());
});

// Endpoint to increment the counter
app.post('/counter', (req, res) => 
{
    counter++;

    saveCounter(counter);
    
    res.send(counter.toString());
});


app.listen(PORT, () => console.log('Visitor counter running on port 3000'));