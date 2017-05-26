var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');

router.get('/inserirproduto', function(req, res, next) {
  res.render('pages/produtos/inserirproduto');
});


router.post('/inserirproduto', function (req, res) {
	var name = req.body.nome;
	var price = req.body.preco;
	var availableQtd = req.body.estoque;

	var prod = new Produtos({ name: name, price: price, availableQtd: availableQtd });
	prod.save(function (err) {
		if (err) {
			console.log("Error! " + err.message);
			return err;
		}
		else{
			console.log("Post saved");
			res.redirect("listarproduto");
		}
	});
});

router.post('/editarproduto', function (req, res) {
	var name = req.body.nome;
	var price = req.body.preco;
	var availableQtd = req.body.estoque;
	var id = req.body.id;
	Produtos.findByIdAndUpdate(id, {$set: {
			name: name,
			price: price,
			availableQtd: availableQtd }}, function (err) {
		if (err) {
			console.log("Error! " + err.message);
			return err;
		}
		else{
			console.log("Post edited");
			res.redirect("listarproduto");
		}
		});
});


router.get('/listarproduto', function(req, res) {
 var db = require("../db");
 Produtos.find({}).lean().exec(
  function (e, docs) {
    res.render('pages/produtos/listarproduto', { "produtos": docs });
  });
});

router.get('/editarproduto', function(req, res) {
 var id = req.query.id;
 Produtos.find({ _id: id }).lean().exec(
 function (e, docs) {
    res.render('pages/produtos/editarproduto', { "produtos": docs });
  });
});

router.get('/deletarproduto', function(req,res){
  var id = req.query.id;
  Produtos.findByIdAndRemove(id,function(err){
    if(err){
     console.log("Error! " + err.message);
     return err; 
   }else{
    res.redirect("listarproduto");
  }});
});

module.exports = router;