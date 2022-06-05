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
const req = require('express/lib/request');
const res = require('express/lib/response');
const uri = "mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority"; 
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

router.get('/', (req, res) => {
    if (req.session.auth == true && req.session.user.role == 'admin') {
        mongoClient.connect(async function(error, mongo) {
            let db = mongo.db('tempbase');
            let coll = db.collection('users');
            let users = await coll.find().toArray();
            let doccoll = db.collection('doctors');
            let doctors = await doccoll.find().toArray();
            res.render('admin', {users, doctors});
        });
    } else {
        res.send(`Acces is not allowed`)
    }
})

router.get('/user/delete/:username', function(req, res) {
    let username = req.params.username;
    console.log('User ' + username + ' deleted successfully')
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('users')
        await coll.deleteOne({'username': username});
        res.redirect('/admin')
    })
}); 


router.get('/user/edit/:username', function(req, res) {
    let username = req.params.username;
		console.log(username)
		mongoClient.connect(async function(error, mongo) {
			let db = mongo.db('tempbase')
			let coll = db.collection('users')
			let user = await coll.findOne({'username': username});
			res.render('edit', {user});
		})
})

router.post('/user/editFin/:username', function(req, res) {
    let namee = req.params.username;
    console.log(req.body.username)
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('users')
        await coll.updateOne({username: namee}, {$set: {name: req.body.name, password:req.body.password, username: req.body.username, email: req.body.email, city:req.body.city}})
        res.redirect('/admin')
    })
        
}); 

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



router.post('/doctor/adddoctor', function(req, res) {
    var fullname = req.body.fullname;
    var username = req.body.username;
    var imagelink = req.body.imagelink;
    var position = req.body.position;
    var instalink = req.body.instalink;
    var otziv = req.body.otziv;

    var tempdata = {
        "fullname" : fullname,
        "username" : username,
        "imagelink" : imagelink,
        "position" : position,
        "instalink" : instalink,
        "otziv" : otziv
    }

    var scdata = { 
        "username" : username,
        "days": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"], 
        "schedule" : [
            [false, true, false, false, false, false],
            [false, true, false, false, false, false],
            [false, true, false, false, false, false],
            [false, true, false, false, false, false],
            [false, true, false, false, false, false]
        ]
    }

    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let coll = db.collection('doctors');
        let sccoll = db.collection('doctorschedule');
        
        await coll.insertOne(tempdata);
        await sccoll.insertOne(scdata);
    });
    res.redirect('/admin')
        
})

router.get('/user/editDoc/:username', function(req, res) {
    let username = req.params.username;
		console.log(username)
		mongoClient.connect(async function(error, mongo) {
			
			let db = mongo.db('tempbase')
			let coll = db.collection('doctors')
			let user = await coll.findOne({'username': username});
			res.render('editdoctor', {user});
		})
})

router.post('/user/editDocFin/:username', function(req, res) {
    let namee = req.params.username;
    console.log(req.body.username)
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('doctors')
        await coll.updateOne({'username': namee}, {$set: {'fullname': req.body.fullname, 'position':req.body.position, username: req.body.username, imagelink: req.body.imagelink, instalink:req.body.instalink, otziv: req.body.otziv}})
        res.redirect('/admin')
    })
        
});

router.get('/user/deleteDoc/:username', function(req, res) {
    let username = req.params.username;
    console.log('Doctor ' + username + ' deleted successfully')
    mongoClient.connect(async function(error, mongo) {
        
        let db = mongo.db('tempbase')
        let coll = db.collection('doctors')
        await coll.deleteOne({'username': username});
        res.redirect('/admin')
    })
}); 

router.get('/feedbacks', (req, res) => {
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase')
        let coll = db.collection('contactUs')

        let feedbacks = await coll.find().toArray();

        if(req.session.auth == true && req.session.user.role == "admin") {
            res.render('feedback_watch', {feedbacks})
        }
    })
})

router.get('/delete-feedback/:last_time', (req, res) => {
    let target = req.params.last_time;
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase')
        let coll = db.collection('contactUs')

        await coll.deleteOne({'last_time': target});
        console.log(await coll.findOne({'last_time': target}))
        res.redirect('/admin/feedbacks')
    })
})

module.exports = router