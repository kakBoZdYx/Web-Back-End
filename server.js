const express = require('express') //dependencies of Node app
const app = express()
const bodyParser = require('body-parser')
const passwordValidator = require('password-validator');
const path = require('path')
const src = path.join(__dirname, '/src/web-page-source')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const dotenv = require('dotenv');
dotenv.config();

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

app.use(bodyParser.json()); //list of middlewares
app.use(express.static('site'))
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views/'));

app.use(express.static(src)) //joining static files as js, css

const { MongoClient, ServerApiVersion } = require('mongodb'); //MongoDb Connection
const uri = "mongodb+srv://kurivyan:123321Qwerty@cluster0.j1pyu.mongodb.net/?retryWrites=true&w=majority"; 
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const userRout = require(path.join(__dirname, '/src/routs/user.js'))//making routs
app.use('/user', userRout)
//
const adminRout = require(path.join(__dirname, '/src/routs/admin.js'))
app.use('/admin', adminRout)

const doctorsRout = require(path.join(__dirname, 'src/routs/doctors.js'))
app.use('/doctors', doctorsRout)

app.get('/' , function(req, res) {res.sendFile(path.join(__dirname, '/src/web-page-source/index.html'))})

app.post('/feedback', (req, res) => {
  var fb_name = req.body.feedback_name
  var fb_email = req.body.feedback_email
  var fb_phone = req.body.feedback_phone
  var fb_message = req.body.feedback_message
  var datentime = new Date();

  var feebackSchema = { 
    "name" : fb_name,
    "email" : fb_email,
    "phone" : fb_phone,
    "message" : fb_message,
    "last_time" : datentime
  }

  mongoClient.connect(async function(error, mongo) {
    let db = mongo.db('tempbase');
    let coll = db.collection('contactUs');
           
    await coll.insertOne(feebackSchema);
    res.redirect('/')
    })
});

app.get('/to-workout', (req,res) => {
  res.sendFile(path.join(__dirname, '/src/web-page-source/secondaryPages/workouts.html'))
})

app.get('/to-food', (req,res) => {
  res.sendFile(path.join(__dirname, '/src/web-page-source/secondaryPages/food.html'))
})

app.listen(3000, () => {console.log(`Server Started`)})