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
    var curentUser = req.session.user
    var temp_doctor = req.params.username;
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');  
      let doccoll = db.collection('doctors');

      let render_doctor = await doccoll.findOne({'username': temp_doctor});
            res.render('doctorProfile', {render_doctor, curentUser})
  });
})

router.post('/doctorProfile/saveReview/:username', (req, res) => {
  var review = req.body.review;
  console.log(review);ы
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctors');
      let render_doctor = await doccoll.findOne({'username': req.params.username});
      res.redirect('/doctors/doctorProfile/' + req.params.username)
  });
})

router.get('/doctorZapis/:username', (req, res) => { 
  if(typeof(req.session.user) !== 'undefined') {
    mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      let render_doctor = await doccoll.findOne({'username': req.params.username});
      res.render('doctorZapis', {render_doctor})
      console.log(render_doctor.schedule)
    });
 }
 else {
    res.redirect('/user/login')
 }
})


router.get('/truefyMn/:username/:i/:j', (req, res) => {
    var username = req.params.username;
    var truth = req.params.i + '.' + req.params.j;
    console.log(truth)
    console.log(req.session.user.username)
    var fit = "schedule." + truth; 
    var link = '/doctors/doctorZapis/' + username;
    mongoClient.connect(async function(error, mongo) {
        let db = mongo.db('tempbase');
        let doccoll = db.collection('doctorschedule');
        await doccoll.updateOne({"username" : username}, {$set: {[fit]: {status: true, author: req.session.user.username}}});
        res.redirect(link);
    });
    console.log(fit)
})

router.get('/falseFy/:username/:i/:j', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i + '.' + req.params.j;
  console.log(truth)
  console.log(req.session.user.username)
  var fit = "schedule." + truth; 
  var link = '/doctors/' + username + '/acceptZapis';
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      await doccoll.updateOne({"username" : username}, {$set: {[fit]: {status: false, author: 0}}});
      res.redirect(link);
  });
  console.log(fit)
})

// router.get('/test', (req, res) => {
//   mongoClient.connect(async function(error, mongo) {
//     let db = mongo.db('tempbase')
//     let doccoll = db.collection('doctors')
//     await doccoll.updateOne({'username': 'doctor_1'}, {$push: {{'otziv': 'pizdec', 'author' : req}}})
//     var x = await doccoll.findOne({username: 'doctor_1'})
//     console.log(x)
//   })
//   console.log('min')
//   res.sendStatus(200)
// })

router.post('/doctorProfile/addReview/:username', (req, res) => {
  var review = req.body.review;
  var author_username = req.session.user.username;
  var link = '/doctors/doctorProfile/' + req.params.username;
  console.log(req.params.username)
  console.log(req.session.user.username)
  console.log(review)
  mongoClient.connect(async function(error, mongo) {
    let db = mongo.db('tempbase')
    let doccoll = db.collection('doctors')
    await doccoll.updateOne({'username': req.params.username}, {$push: {otziv : {'otziv': review, 'author': author_username}}})
  })
  res.redirect(link)
})

router.get('/:username/acceptZapis', (req, res) => {
  var doctor_username = req.params.username;
  var user_username = req.session.user.username;
  mongoClient.connect(async function(error, mongo) {
    let db = mongo.db('tempbase')
    let coll = db.collection('doctorschedule')
    let doctor_table = await coll.findOne({'username': doctor_username})
    res.render('doctorZapisTable', {doctor_table})
  })
})


router.get('/reset', (req, res) => {
  var username = req.params.username;
  var truth = req.params.i;
  var rec_user = '0';
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let doccoll = db.collection('doctorschedule');
      var tempdata = { 
        "username" : "doctor_1",
        "days": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"], 
        "schedule" : [
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}]
        ]
      }
      var tempdata2 = { 
        "username" : "doctor_2",
        "days": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"], 
        "schedule" : [
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}]
        ]
      }
      var tempdata3 = { 
        "username" : "doctor_3",
        "days": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"], 
        "schedule" : [
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}],
          [{status: false, author: rec_user}, {status: true, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}, {status: false, author: rec_user}]
        ]
      }
      await doccoll.deleteMany({});
      await doccoll.insertOne(tempdata);
      await doccoll.insertOne(tempdata2);
      await doccoll.insertOne(tempdata3);
      res.redirect('/doctors/');
  });
})

router.get('/patients', (req, res) => {
  mongoClient.connect(async function(error, mongo) {
      let db = mongo.db('tempbase');
      let coll = db.collection('users');
      let users = await coll.find().toArray();
      res.render('test', {users});
  });
})

router.post('/:patientUsername/recomendationSet', (req, res) => {
  mongoClient.connect(async function(error, mongo) {
    let db = mongo.db('tempbase');
    let coll = db.collection('recomendations');
    var recomendationOrigin = req.session.user.username
    var recomendationObject = req.params.patientUsername
    var recomendationMessage = req.body.recomendation_content

    var tempData = {
      'doctor' : recomendationOrigin,
      'patient' : recomendationObject,
      'text' : recomendationMessage
    }

    await coll.insertOne(tempData)

    res.redirect('/user/profile/' + req.params.patientUsername)
});
})

module.exports = router