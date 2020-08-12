const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//const cookieSession = require('cookie-session');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const bcrypt = require('bcrypt');
const passport = require('passport');



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
const userSheme = new Schema({
    Email: String,
    Password: String
})


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(multipartMiddleware);

//app.use(require('connect').bodyParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



const Card = mongoose.model("Card", cardSheme);
const User = mongoose.model("User", userSheme);



//let passwordUser = 'test11userPass';
//let salt = bcrypt.genSaltSync(10); // создаем соль
//let passwordToSave = bcrypt.hashSync(passwordUser, salt); // шифруем пароль
//console.log(salt);
//console.log(passwordUser);
//console.log(passwordToSave);

/* app.post('/LogIn', (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        passport.authenticate('local', {
            failureMessage: true
        }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.status(500).send('Error'); }
            req.
        })

        
    } catch (e) {
        console.log(e);
    }
}) */

app.post('/Registration', (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const passwordTwo = req.body.passwordTwo;

        if (/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email) && password.trim() && passwordTwo.trim() && password.trim() === passwordTwo.trim()) {
            const user = new User({
                Email: email,
                Password: password
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.Password, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    user.Password = hash
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send('Reg succses');
                        }
                    })

                })

            })

        } else {
            res.status(500).send('Error');
        }
        

    } catch (e) {
        console.log(e);
    }
})

/* app.get('/LogOut', (req, res) => {
    try {
        



        })
        //res.send('Succses');
    } catch (e) {
        console.log(e);
    }
}) */




app.get('/list', (req, res) => {
    try {
        Card.find(function(err, cardList){
            if (err) {
                res.send('Server error: ' + err);
            }
            let tags = []
            cardList.map(element => {
                if (element.Tag !== '') {
                    tags.push(element.Tag);
                }
            });
            let tagList = Array.from(new Set(tags));
            tagList.sort();
            
            console.log(tagList);
            console.log(cardList);
            res.send({cardList, tagList});
        })
        //res.send(result);
    } catch (e) {
        console.log(e);
    }
})

app.get('/byTag/:tag', (req, res) => {
    try {
        Card.find({'Tag': req.params.tag}, function(err, cardList){
            if (err) {
                res.send('Server error: ' + err);
            }

            Card.find(function(err, list){
                if (err) {
                    res.send('Server error: ' + err);
                }
                let tags = []
                list.map(element => {
                    if (element.Tag !== '') {
                        tags.push(element.Tag);
                    }
                });
                let tagList = Array.from(new Set(tags));
                tagList.sort();

                res.send({cardList, tagList});
            })
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




app.post('/edit', (req, res) => {
    try {

        const Id = req.body.id;
        const Title = req.body.title;
        const Content = req.body.content;
        const Tag = req.body.tag;
        const Date = req.body.date;


        Card.findByIdAndUpdate(Id,
            { _id: Id, Title: Title, Content: Content, Tag: Tag, Date: Date},
            {new: true},
            function (err, result) {
            if (err) {
                res.send('Server error: ' + err);
            }
            res.send('Save card');
        })
    } catch (e) {
        console.log(e);
    }
})

app.post('/create', (req, res) => {
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