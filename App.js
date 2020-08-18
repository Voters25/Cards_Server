const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');

//--------
const LocalStrategy = require('passport-local').Strategy;
//--------

//const Schema = mongoose.Schema;
const router = express.Router();


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




app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(multipartMiddleware);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session());

//let passportMiddlware = require('./passport/passport.js');

const User = require('./model/user')
const Card = require('./model/card')

//const Card = mongoose.model("Card", cardSheme);
//const User = mongoose.model("User", userSheme);


app.use(cookieSession({
    name: 'session',
    keys: ['secret'],
}))

/* const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }); */

/* app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
})) */

/*=========================================================================*/

/*=========================================================================*/


// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
function (email, password, done) {
    console.log('strategy work!!!!')
    // Match Username
    let query = {
        email: email
    };
    console.log(query)//=========================================-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'User undefined'
            });
        }
        // Match Password
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
        });
    });
}));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.post('/Login', function (req, res, next) {

        passport.authenticate('local', { failureMessage: true },
        function (err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(500).send('Error.');
            }
            req.logIn(user, function (err) {
                console.log(req.user);
                res.send({ email: req.user.email })
            })
        })
        (req, res, next);
})


app.post('/Registration', (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const passwordTwo = req.body.passwordTwo;

        if (/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email) && password.trim() && passwordTwo.trim() && password.trim() === passwordTwo.trim()) {
            const user = new User({
                email: email,
                password: password
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    user.password = hash
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
            res.status(500).send('Error.');
        }
        

    } catch (e) {
        console.log(e);
    }
})

router.get('/LogOut', (req, res) => {
    try {
        
        req.logOut();
        res.send('Succses');
        
    } catch (e) {
        console.log(e);
    }
})




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



module.exports = router