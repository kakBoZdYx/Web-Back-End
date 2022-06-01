const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const passwordValidator = require('password-validator');
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(cookieParser())
app.use( // creating and connection express session
    session({
      secret : 'secretkey',
      key : 'seed',
      cookie : {
          httpOnly : true,
          maxAge : null
      },
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

router.get('/', (req, res) => {
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('users');
        let users = await coll.find().toArray();
        let doccoll = db.collection('doctors');
        let doctors = await doccoll.find().toArray();
        res.render('admin', {users, doctors});
    });
})

router.get('/user/delete/:name', function(req, res) {
    let name = req.params.name;
    console.log('User ' + name + ' deleted successfully')
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('users')
        await coll.deleteOne({name: name});
        res.redirect('/admin')
    })
}); 


router.get('/user/edit/:name', function(req, res) {
    let name = req.params.name;
		console.log(name)
		mongoClient.connect(async function(error, mongo) {
			
			let db = mongo.db('tempbase')
			let coll = db.collection('users')
			let user = await coll.findOne({name: name});
			res.render('edit', {user});
		})
})

router.post('/user/add', function(req, res) { 
    console.log('User added successfully');
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
        "email" : email
    }
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('users');
        
        await coll.insertOne(tempdata);
    });
    res.redirect('/admin')
}); 

router.post('/user/editFin/:name', function(req, res) {
    let namee = req.params.name;
    console.log(req.body.name)
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('users')
        await coll.updateOne({name: namee}, {$set: {name: req.body.name, password:req.body.password, username: req.body.username, email: req.body.email, city:req.body.city}})
        res.redirect('/admin')
    })
        
}); 


router.post('/doctor/adddoctor', function(req, res) {
    var fullname = req.body.fullname;
    var imagelink = req.body.imagelink;
    var position = req.body.position;
    var instalink = req.body.instalink;
    var otziv = req.body.otziv;

    var tempdata = {
        "fullname" : fullname,
        "imagelink" : imagelink,
        "position" : position,
        "instalink" : instalink,
        "otziv" : otziv
    }
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('doctors');
        
        await coll.insertOne(tempdata);
    });
    res.send(200);
        
})





module.exports = router