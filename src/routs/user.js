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
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views/'))

var schema = new passwordValidator(); //schema for password 
schema.is().min(7).is().max(25).has().uppercase().has().lowercase().has().digits()

const { MongoClient, ServerApiVersion } = require('mongodb');//MongoDb Connection
const { profile } = require('console');
const { syncBuiltinESMExports } = require('module');
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
        var surname = req.body.surname;
        var datentime = new Date();
        var monster = req.body.monster
        var gender = req.body.gender
    
        var tempdata = {
            "username" : username,
            "password" : password,
            "name" : name,
            "surname" : surname,
            "city" : city,
            "email" : email,
            "role" : "user",
            "last_time" : datentime,
            "photo_url" : monster,
            "gender" : gender
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
    res.sendFile(path.join(__dirname, '../../src/web-page-source/secondaryPages/login.html'))
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
                
                if(req.session.user.role == 'admin'){
                    res.redirect('/admin')
                } else {
                    res.redirect('/user/profile/' + username)
                }
            } else {
                req.session.auth = false
                res.redirect('/user/login' )
            }
        } else {
            req.session.auth = false
            res.redirect('/user/login')
        }
    })    
})

router.get('/profile', (req, res) => {
    if(!req.session.auth && req.session.auth == false) {
        res.redirect('/user/login')
    } else if(req.session.auth == true && req.session.user.role == 'user'){
        var curentUser = req.session.user
        res.redirect('/user/profile/' + curentUser.username)
    }
    else if(req.session.auth == true && req.session.user.role == 'doctor') {
        res.redirect('/doctors/doctorProfile/' + req.session.user.username) 
    } 
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/profile/:x', (req, res) => {
    if(!req.session.auth && req.session.auth == false) {
        res.redirect('/user/login')
    } else if (req.session.user.role == 'doctor' && req.session.user.username == req.params.x) {
        res.redirect('/user/profile')
    }
    else {
        var target = req.params.x
        let userData
        let recdata
        let curentUser = req.session.user
        mongoClient.connect(async function(error, mongo){
            let db = mongo.db('tempbase');
            let coll = db.collection('users');
            let coll1 = db.collection('recomendations')
            
            recdata =  await coll1.find({'patient' : target}).toArray()
            userData = await coll.findOne({'username' : target})

            if(curentUser != undefined) {
                res.render('profile', {userData, curentUser, recdata})
            } else {
                res.render('profile', {userData, curentUser, recdata})
            }
        
        })
    }
})


module.exports = router