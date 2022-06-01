const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const passwordValidator = require('password-validator');
const path = require('path')
const session = require('express-session')

app.use(
    session({
      secret: 'you secret key',
      saveUninitialized: true,
    })
  )

var schema = new passwordValidator(); //schema for password 
schema.is().min(7).is().max(25).has().uppercase().has().lowercase().has().digits()

router.use(bodyParser.json()); //list of middlewares
router.use(express.static('site'))
router.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views/'));

var schema = new passwordValidator(); //schema for password 
schema.is().min(7).is().max(25).has().uppercase().has().lowercase().has().digits()

const { MongoClient, ServerApiVersion } = require('mongodb');//MongoDb Connection
const uri = "mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority"; 
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//localhost:3000/user/registration
router.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/web-page-source/secondaryPages/registrationPages/registration.html'))
}).post('/registration', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var city = req.body.city;
        var name = req.body.name;
        var datentime = new Date();
    
        var tempdata = {
            "username" : username,
            "password" : password,
            "last_time" : datentime,
            "name" : name,
            "city" : city,
            "email" : email,
            "role" : "user"
        }
        mongoClient.connect(async function(error, mongo) {
            let db = mongo.db('tempbase');
            let coll = db.collection('users');
            
            if (schema.validate(password) == true) {       
                await coll.insertOne(tempdata);
                res.sendFile('../../src/web-page-source/secondaryPages/registrationPages/registrationsucces.html' , { root : __dirname});
            }
            else {
                res.sendFile('../../src/web-page-source/secondaryPages/registrationPages/registrationfail.html' , { root : __dirname});
            }
        });
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/web-page-source/secondaryPages/login.html'))
}).post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('users');
        
        if (coll.find(username) && coll.find(password)) {
            res.sendStatus(200)
            req.session.username = req.body.username
            console.log(req.session.username)
        };
    })    
})

module.exports = router