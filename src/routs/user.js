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
        resave: 'true',
        key : 'sid',
        saveUninitialized: 'false',
      store: MongoStore.create({ mongoUrl: 'mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority' })
    })
  )


var schema = new passwordValidator(); //schema for password 
schema.is().min(7).is().max(25).has().uppercase().has().lowercase().has().digits()

router.use(bodyParser.json()); //list of middlewares
router.use(express.static('site'))
router.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, './src/views/'));
app.set('view engine', 'jade')
app.set('view engine', 'ejs')



var schema = new passwordValidator(); //schema for password 
schema.is().min(7).is().max(25).has().uppercase().has().lowercase().has().digits()

const { MongoClient, ServerApiVersion } = require('mongodb');//MongoDb Connection
const { profile } = require('console');
const req = require('express/lib/request');
const uri = "mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority"; 
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//localhost:3000/user/registration
router.get('/registration', (req, res) => {
    if(req.session.auth == true){
        res.redirect('/user/profile')
        
    } else {
        res.sendFile(path.join(__dirname, '../../src/web-page-source/secondaryPages/registrationPages/registration.html'))
    }
    
}).post('/registration', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var city = req.body.city;
        var name = req.body.name;
        var surname = req.body.surname;
        var datentime = new Date();
        var monster = req.body.monster
    
        var tempdata = {
            "username" : username,
            "password" : password,
            "name" : name,
            "surname" : surname,
            "city" : city,
            "email" : email,
            "role" : "user",
            "last_time" : datentime,
            "photo_url" : monster
        }
        mongoClient.connect(async function(error, mongo) {
            let db = mongo.db('tempbase');
            let coll = db.collection('users');
            
            if (schema.validate(password) == true) {       
                await coll.insertOne(tempdata);
                res.redirect('/user/login')
            }
            else {
                res.redirect('/user/registration')
            }
        });
})

router.get('/login', (req, res) => {
    if(req.session.auth == true){
        res.redirect('/user/profile')
    } else {
        res.sendFile(path.join(__dirname, '../../src/web-page-source/secondaryPages/login.html'))
    }
}).post('/login', (req, res) => {

    var username = req.body.login_username;
    var password = req.body.login_password;

    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('users');

        var userData = await coll.findOne({"username" : username})
        
        if(await coll.findOne({"username" : username})){
            if((await coll.findOne({"username" : username})).password == password) {
                req.session.auth = true
                req.session.user = userData
                req.session.userrole = (await coll.findOne({"username" : username})).role
                
                if(req.session.userrole == 'admin'){
                    res.redirect('/admin')
                } else {
                    res.redirect('/user/profile')
                }
            } else {
                req.session.auth = false
                res.redirect('/user/login')
            }
        } else {
            req.session.auth = false
            res.redirect('/user/login')
        }
    })    
})

router.get('/profile', (req, res) => {
    if(req.session.auth == true) {
        var userData = req.session.user
        res.render('profile', {userData})
    } else {
        res.redirect('/user/login')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    console.log('21312312')
    res.redirect('/')
})

router.get('/test', (req, res) => {
    var username = "admin"

    mongoClient.connect(async function(error, mongo){
        let db = mongo.db('tempbase')
        let coll = db.collection('users')
        
        var zxc = 

        console.log((await coll.findOne({"username" : "admin"})).password)
    })

    res.sendStatus(200)
})


module.exports = router