var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
res.render('pages/helloworld', { title: 'Hello, World!' });
});

/* GET Pedido page. */
router.get('/pedido', function(req, res) {
res.render('pages/pedido', { title: 'Hello, World!' });
});

/* GET Estoque page. */
router.get('/estoque', function(req, res) {
res.render('pages/estoque', { title: 'Hello, World!' });
});

/* GET Relatório page. */
router.get('/relatorio', function(req, res) {
res.render('pages/relatorio', { title: 'Hello, World!' });
});

/* GET Produto page. */
router.get('/produto', function(req, res) {
res.render('pages/produto', { title: 'Hello, World!' });
});

// /* POST to Add User Service */
// router.post('/adduser', function (req, res) {

//     var db = require("../db");
//     var userName = req.body.username;
//     var userEmail = req.body.useremail;

//     var Users = db.Mongoose.model(vendedorcollection', db.SellerSchema, 'vendedorcollection');
//     var user = new Users({ username: userName, email: userEmail });
//     user.save(function (err) {
//         if (err) {
//             console.log("Error! " + err.message);
//             return err;
//         }
//         else {
//             console.log("Post saved");
//             res.redirect("userlist");
//         }
//     });
// });

// /* GET Userlist page. */
// router.get('/userlist', function(req, res) {
//    var db = require("../db");
//    var Users = db.Mongoose.model('vendedorcollection', db.SellerSchema, 'vendedorcollection');
//    Users.find({}).lean().exec(
//       function (e, docs) {
//          res.render('pages/userlist', { "userlist": docs });
//    });
// });

/* GET New User page. */
router.get('/newuser', function(req, res) {
res.render('pages/newuser', { title: 'Add New User' });
});

module.exports = router;
