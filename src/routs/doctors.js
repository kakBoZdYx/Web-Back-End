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
app.set('views', path.join(__dirname, './src/views/'));



const { MongoClient, ServerApiVersion } = require('mongodb');//MongoDb Connection
const uri = "mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority"; 
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

router.get('/', (req, res) => {
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let doccoll = db.collection('doctors');
        let doctors = await doccoll.find().toArray();
        res.render('doctors', {doctors});
    });
})


router.get('/doctorProfile/:username', (req, res) => {
  var temp_doctor = req.params.username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctors');
      let render_doctor = await doccoll.findOne({'username': temp_doctor});
      res.render('doctorProfile', {render_doctor})
  });
})

router.post('/doctorProfile/saveReview/:username', (req, res) => {
  var review = req.body.review;
  console.log(review);
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctors');
      let render_doctor = await doccoll.findOne({'username': req.params.username});
      res.redirect('/doctors/doctorProfile/' + req.params.username)
  });
})

router.get('/doctorZapis/:username', (req, res) => { 
  mongoClient.connect(async function(error, mongo) {
    let db = mongo.db('tempbase');
    let doccoll = db.collection('doctorschedule');
    let render_doctor = await doccoll.findOne({'username': req.params.username});
    res.render('doctorZapis', {render_doctor})
    console.log(render_doctor.schedule.mn[1])
});
})



router.get('/truefyMn/:username/:i', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var fit = "schedule.mn." + truth; 
  var link = '/doctors/doctorZapis/' + username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: true}});
      res.redirect(link);
  });
})

router.get('/truefyTu/:username/:i', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var fit = "schedule.tu." + truth; 
  var link = '/doctors/doctorZapis/' + username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: true}});
      res.redirect(link);
  });
})

router.get('/truefyWd/:username/:i', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var fit = "schedule.wd." + truth; 
  var link = '/doctors/doctorZapis/' + username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: true}});
      res.redirect(link);
  });
})

router.get('/truefyTh/:username/:i', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var fit = "schedule.th." + truth; 
  var link = '/doctors/doctorZapis/' + username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: true}});
      res.redirect(link);
  });
})

router.get('/truefyFr/:username/:i', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var fit = "schedule.fr." + truth; 
  var link = '/doctors/doctorZapis/' + username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: true}});
      res.redirect(link);
  });
})








router.get('/reset', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      var tempdata = { 
        "username" : "doctor_1",
        "schedule" : {
        "mn" : [false, false, false, false, false, false],
        "tu" : [false, false, false, false, false, false],
        "wd" : [false, false, false, false, false, false],
        "th" : [false, false, false, false, false, false],
        "fr" : [false, false, false, false, false, false]
        }
      }
      var tempdata2 = { 
        "username" : "doctor_2",
        "schedule" : {
        "mn" : [false, false, false, false, false, false],
        "tu" : [false, false, false, false, false, false],
        "wd" : [false, false, false, false, false, false],
        "th" : [false, false, false, false, false, false],
        "fr" : [false, false, false, false, false, false]
        }
      }
      var tempdata3 = { 
        "username" : "doctor_3",
        "schedule" : {
        "mn" : [false, false, false, false, false, false],
        "tu" : [false, false, false, false, false, false],
        "wd" : [false, false, false, false, false, false],
        "th" : [false, false, false, false, false, false],
        "fr" : [false, false, false, false, false, false]
        }
      }
      await doccoll.deleteMany({});
      await doccoll.insertOne(tempdata);
      await doccoll.insertOne(tempdata2);
      await doccoll.insertOne(tempdata3);
      res.sendStatus(200);
  });
})



module.exports = router