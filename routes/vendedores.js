var express = require('express');
var router = express.Router();
var db = require("../db");
var Vendedores = db.Mongoose.model('vendedorcollection', db.SellerSchema, 'vendedorcollection');

router.get('/adicionar', function(req, res, next) {
  res.render('pages/vendedores/add');
});


router.post('/adicionar', function (req, res) {
  var nome = req.body.nome;
  var vendedor = new Vendedores({ nome: nome});
  vendedor.save(function (err) {
    if (err) {
      console.log("Error! " + err.message);
      return err;
    }
    else {
      console.log("Post saved");
      res.redirect("lista");
    }
  });
});


router.get('/lista', function(req, res) {
 var db = require("../db");
 Vendedores.find({}).lean().exec(
  function (e, docs) {
    res.render('pages/vendedores/list', { "vendedores": docs });
  });
});

router.get('/deletar', function(req,res){
  var id = req.query.id;
  Vendedores.findByIdAndRemove(id,function(err){
    if(err){
     console.log("Error! " + err.message);
     return err; 
   }else{
    res.redirect("lista");
  }});
});

module.exports = router;