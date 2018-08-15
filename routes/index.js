var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');

// connexion vers BDD mongoose (mlab)
var dbUser = 'bdduser';
var dbPassword = 'endives2018';
var server_uri = 'ds163730.mlab.com:63730';
var dbName = 'bddmarcoboulo';

var options = { server: { socketOptions: {connectTimeoutMS: 3000 } }};
// mongoose.connect('mongodb://Jenn:mlab123@ds161751.mlab.com:61751/uniqueguide',
mongoose.connect('mongodb://' + dbUser + ':' + dbPassword + '@' + server_uri + '/' + dbName,
    options,
    function(err) {
     console.log(err);
    }
);

// schema user
var userSchema = mongoose.Schema({

  last_name:String,
  first_name:String,
  email:String,
  password:String,

  // first_name: String,
  // last_name: String,
  // email: String,
  // password: String,
})
// modèle user (collection users + lien vers le schema user)
// var UserModel = mongoose.model('users', userSchema);
// "visiteurs" est le nom de la collection dans la Bdd
var UserModel = mongoose.model("visiteurs", userSchema);

// schema history
var historySchema = mongoose.Schema({
  id_user: String,
  id_product: String,
  date: Date,
})

var HistoryModel = mongoose.model('histories', historySchema);


/********************** GET home page. **********************/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guide Touristique4' });
});


/********************** POST SIGN UP = créé un user dans le BDD **********************/
router.post('/signup', function(req, res, next) {

  console.log('route signup');

  // créé un nouvel user
  var newUser = new UserModel ({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  })

  // sauvegarde nouvel user dans BDD
  newUser.save(
    function (error, user) {
      console.log('user saved', user);
      res.json({ user });
    }
  );

});


/********************** GET SIGN IN = Vérifie l’existance d’un user **********************/
router.get('/signin', function(req, res, next) {

  UserModel.findOne(
    { email: req.query.email, password: req.query.password },
    function (err, user) {
      console.log('user find');
      res.json({ user});
    }
  )

});


/********************** POST UPDATE USER = modifie le user **********************/
router.put('/updateUser/:id', function(req, res, next) {

    UserModel.update(
      { _id: req.params.id},
      { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password },
      function(error, result) {

        UserModel.findOne(
          { _id: req.params.id },
          function (err, user) {
            console.log('user updated');
            res.json({ user});
          }
        )

      }
    );

});


/********************** POST History Update **********************/
router.post('/historyUpdate', function(req, res) {

  // créé un nouvelle photo
  var newHistory = new HistoryModel ({
    id_user: req.body.id_user,
    id_product: req.body.id_product,
    date: req.body.date,
  })

  // sauvegarde nouvelle photo dans BDD
  newHistory.save(
    function (error, history) {
      console.log('history saved');
      res.json({ history });
    }
  );

})


/********************** GET History **********************/
router.get('/history', function(req, res) {

  HistoryModel.find(
    { id_user: req.query.id_user },
    function (err, history) {
        console.log('history find');
        res.json({ history });
      }
  )

})



module.exports = router;
