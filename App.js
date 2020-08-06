const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { text } = require('body-parser');

const Schema = mongoose.Schema; // -------------------------

const app = express();


const port = 5000;
app.listen(port, () => {
    console.log('Start on ' + port);
})

const login = 'Voters25';
const password = 'Voters25';
const dbname = 'Cards-data';

mongoose.connect(`mongodb+srv://${login}:${password}@cluster0.m8p3z.mongodb.net/${dbname}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {console.log("Db start")});


// Схемы
/* const userScheme = new Schema({
    name: String
}); */


const cardSheme = new Schema({
    Title: String,
    Content: String
})



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));




// Сохранение в базу
/* const User = mongoose.model("User", userScheme);
const user = new User({
    name: "Nekto"
}); */
/* user.save(function(err){

    if (err) return console.log(err);
    console.log("Save user", user);
}); */




const Card = mongoose.model("Card", cardSheme);
/* const card = new Card({
    Title: 'Test title',
    Content: 'Test content.................................'
}) */
/* card.save(function(err){

    if (err) return console.log(err);
    console.log("Save card", card);
}); */







/* User.find(function(err, doc){
    mongoose.disconnect();
    if (err) return console.log(err);
    console.log(doc);
}) */

/* User.findOne({name: 'Daniil'}, function(err, doc){
    mongoose.disconnect();
    if (err) return console.log(err);
    console.log(doc);
}) */


/* Card.find(function(err, res){

    if (err) {
        res.send('Server error: ' + err);
    }

    console.log(res);
})
 */




app.get('/list', (req, res) => {
    try {
        Card.find(function(err, result){
            if (err) {
                res.send('Server error: ' + err);
            }
            console.log(result);
            res.send(result);
        })
        //res.send(result);
    } catch (e) {
        console.log(e);
    }
})

app.get('/card/:id', (req, res) => {
    try {
        //console.log(req.params.id);
        Card.findById(req.params.id, function(err, result){
            if (err) {
                res.send('Server error: ' + err);
            }
            console.log(result);
            res.send(result);
        })
    } catch (e) {
        console.log(e);
    }
})

app.get('/delete/:id', (req, res) => {
    try {
        Card.findByIdAndDelete(req.params.id, function(err, result){
            if (err) {
                res.send('Server error: ' + err);
            }
            //console.log(result);
            res.send('Card delete');
        })
    } catch (e) {
        console.log(e);
    }
})

app.post('/edit', (req, res) => { // ПРОТЕСТИ
    try {
        Card.findByIdAndDelete(req.body.id, function(err, result){
            if (err) {
                res.send('Server error: ' + err);
            } else {
                const card = new Card({
                    Title: req.body.Title,
                    Content:req.body.Content
                })
                card.save(function(err){
    
                    if (err) return console.log(err);
                    console.log("Save card", card);
                });
            }
            res.send('Save card');
        })
    } catch (e) {
        console.log(e);
    }
})