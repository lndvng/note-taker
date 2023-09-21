// importing express package
const express = require('express');

const path = require('path');
const fs = require('fs');

// specifying which port the server will run
const PORT = 8080;

// initializing instance of express.js
const app = express();
app.use(express.static('public'));

// sending html for notesPage using res.sendNotes method
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
})

// 
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF-8', (err, data) => {
        res.json(JSON.parse(data))
    });
})

//
app.post('/api/notes', (req, res) => {
     
})

// fallback route for when a user attempts to visit routes that don't exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
})

// port listener that displays link to server's current localhost port
app.listen(PORT, () =>
    console.log(`Live at http://localhost:${PORT}`)
);