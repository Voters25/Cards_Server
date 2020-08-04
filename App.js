const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

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



/* const uri = `mongodb+srv://${login}:${password}>@cluster0.m8p3z.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */




app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));




app.get('/test', function(req, res) {
    try {
        res.send('succses');
        console.log('succses');
    } catch (e) {
        console.log(e);
    }
})