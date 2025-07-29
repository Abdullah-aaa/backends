const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            //to send the data to ejs frontend page 
            res.render('index.ejs', { files: files });
        }
    });
});

app.get('/file/:filename', (req, res) => {
    // utf8 is for converting to readable english string
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, filedata) => {
        if (err) {
            console.log(err);
        } else {
          
            //to send the data to ejs frontend page filename = title and filedata = description
            res.render('show.ejs', {filename: req.params.filename ,filedata: filedata });
        }
    });
});


app.post('/create', (req, res) => {
    //will create a new file in files folder and work like database
    fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.details, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file created');
        }
    });
    res.redirect('/');
});

//for sending to edit UI page
app.get('/edit/:filename', (req, res) => {
 res.render('edit.ejs', {filename: req.params.filename});
   
});
// for renaming data
app.post('/edit/:filename', (req, res) => {
    
    fs.rename(`./files/${req.params.filename}`, `./files/${req.body.new.split(" ").join("")}.txt`, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file renamed');
        }
    });
    res.redirect('/');
});






app.listen(3000, () => {
    console.log('running port 3000!');
});