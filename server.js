const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data from requests
app.use(express.json()); // Automatically parse JSON bodies

// Enable CORS for all domains
app.use(cors());

// Path to data.json file
const dataFilePath = path.join(__dirname, 'data', 'data.json');

// Route to serve static JSON data
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ message: 'Error reading data' });
        }

        try {
            const jsonData = JSON.parse(data);  // Ensure valid JSON format
            res.json(jsonData);  // Send JSON data to the client
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ message: 'Error parsing data' });
        }
    });
});

// Route to add new user data
app.post('/api/data', (req, res) => {
    const newUser = req.body;

    // Validate the incoming data
    if (!newUser || !newUser.name || !newUser.email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ message: 'Error reading data' });
        }

        try {
            const jsonData = JSON.parse(data);  // Parse the current data
            jsonData.users.push(newUser);  // Add the new user to the list

            // Write the updated data back to the file
            fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing data:', err);
                    return res.status(500).json({ message: 'Error saving new user' });
                }

                res.status(201).json({ message: 'User added successfully', user: newUser });
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ message: 'Error parsing data' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
