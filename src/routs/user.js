const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const passwordValidator = require('password-validator');
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

router.use(cookieParser())
router.use( // creating and connection express session
    session({
        secret: 'my key',
        resave: 'false',
        saveUninitialized: 'false',
      store: MongoStore.create({ mongoUrl: 'mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority' })
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

    req.session.lgusername = req.body.login_username;
    req.session.lgpassword = req.body.login_password;

    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('users');

        console.log(await coll.findOne({username : req.session.lgusername}).password)
        
        if(await coll.findOne({username : req.session.lgusername}) == true){
            if(await coll.findOne({username : req.session.lgusername}).password == req.session.lgpassword) {
                req.session.auth = true
                console.log(req.session.auth)
                res.sendStatus(200)
            } else {
                req.session.auth = false
                console.log(req.session.auth)
                res.sendStatus(200)
            }
        } else {
            req.session.auth = false
            console.log(req.session.auth)
            res.sendStatus(200)
        }
        console.log(await coll.findOne({username : req.session.lgusername}).password + " " + password)
        console.log(await coll.findOne({username : req.session.lgusername}) + " " + username)
    })    
})

router.get('/profile', (req, res) => { 
    res.render('profile')
})

router.get('/test', (req, res) => {
    req.session.testsession = false
    res.sendStatus(200)
})

module.exports = router