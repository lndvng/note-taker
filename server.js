// importing packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');

// specifying which port the server will run
const PORT = process.env.PORT || 8080;

// initializing instance of express.js
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Promise version of fs.readFile
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// sending html for notesPage using res.sendNotes method
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
});

// get route for notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF-8', (err, data) => {
        res.json(JSON.parse(data))
    });
});

// post request for notes
app.post('/api/notes', (req, res) => {
     console.info(`${req.method} request received to add a note)`);

     const { title, text } = req.body;

     if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote
        }

        res.json(response);
     } else {
        res.json(`Error in adding notes`);
     }
});

// fallback route for when a user attempts to visit routes that don't exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

// port listener that displays link to server's current localhost port
app.listen(PORT, () =>
    console.log(`Live at http://localhost:${PORT}`)
);