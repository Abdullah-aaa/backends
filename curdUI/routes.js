const express = require('express');
const path = require('path'); 
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

const usermodel = require('./userModel');
const { log } = require('console');

app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.render('index.ejs');
});

app.post('/create', async (req, res) => {
    const user = await usermodel.create(req.body);
    
    console.log(req.body);
    res.redirect('/read');
});

app.get('/read', async(req, res) => {
    const user = await usermodel.find();
    res.render('read.ejs', {user:user });
});


app.get('/delete/:id', async(req, res) => {
    const user = await usermodel.findOneAndDelete(req.params.id);
    res.redirect('/read');
})

app.get('/edit/:id', async(req, res) => {
    const user = await usermodel.findOne({_id: req.params.id});
    res.render('edit.ejs', {user});
   
    
})

app.post('/update/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await usermodel.findOneAndUpdate(
            { _id: req.params.id },
            { name, email, password },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).send('User not found');
        }
       
        res.redirect('/read');
    } catch (err) {
        console.log('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});


app.listen(3000,() =>{
    console.log("Server is running on port 3000");
    
});