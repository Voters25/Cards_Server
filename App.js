const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

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
const userScheme = new Schema({
    name: String
});
const cardScheme = new Schema({
    text: String
});



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));




// Сохранение в базу
const User = mongoose.model("User", userScheme);
const user = new User({
    name: "Nekto"
});
/* user.save(function(err){

    if (err) return console.log(err);
    console.log("Save user", user);
}); */


// Сохранение в базу
const Card = mongoose.model("Card", cardScheme);
const card = new Card({
    text: "Hi"
});
/* card.save(function(err){

    if (err) return console.log(err);
    console.log("Save card", card);
}); */





User.find(function(err, doc){
    mongoose.disconnect();
    if (err) return console.log(err);
    console.log(doc);
})

User.findOne({name: 'Daniil'}, function(err, doc){
    mongoose.disconnect();
    if (err) return console.log(err);
    console.log(doc);
})




/* app.get('/test', function(req, res) {
    try {
        res.send('succses');
        console.log('succses');
    } catch (e) {
        console.log(e);
    }
}) */