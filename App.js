const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//const cookieSession = require('cookie-session');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();



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
    Content: String,
    Tag: String,
    Date: String,
})



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(multipartMiddleware);

//app.use(require('connect').bodyParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


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
        Card.find(function(err, cardList){
            if (err) {
                res.send('Server error: ' + err);
            }
            let tags = []
            cardList.map(element => {
                tags.push(element.Tag);
            });
            let tagList = Array.from(new Set(tags));

            console.log(tagList);
            console.log(cardList);
            res.send({cardList, tagList});
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
        Card.findByIdAndDelete(req.body.id, function (err, result) {
            if (err) {
                res.send('Server error: ' + err);
            }
            const card = new Card({
                Title: req.body.title,
                Content: req.body.content,
                Tag: req.body.tag,
                Date: req.body.date
            })
            card.save(function (err) {
                if (err) return console.log(err);
                console.log("Save card", card);
            });
            res.send('Save card');
        })
    } catch (e) {
        console.log(e);
    }
})

app.post('/create', (req, res) => { // ПРОТЕСТИ
    try {

        const Title = req.body.title;
        const Content = req.body.content;
        const Tag = req.body.tag;
        const Date = req.body.date;

        const card = new Card({
            Title: Title,
            Content: Content,
            Tag: Tag,
            Date: Date
        })

        card.save(function (err) {
            if (err) return console.log(err);
            console.log("Save card", card);
        });
        res.send('Save card');
    } catch (e) {
        console.log(e);
    }
})