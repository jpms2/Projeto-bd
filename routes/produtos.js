var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');

//Add
router.get('/adicionar', function(req, res, next) {
  res.render('pages/produtos/add');
});

router.post('/adicionar', function (req, res) {
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
			res.redirect("listar");
		}
	});
});

//Edit
router.get('/editar', function(req, res) {
 var id = req.query.id;
 Produtos.findById(id).lean().exec(
 function (e, docs) {
    res.render('pages/produtos/edit', { "produto": docs });
  });
});

router.post('/editar', function (req, res) {
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
			res.redirect("listar");
		}
		});
});

//List
router.get('/listar', function(req, res) {
 var db = require("../db");
 Produtos.find({}).lean().exec(
  function (e, docs) {
    res.render('pages/produtos/list', { "produtos": docs });
  });
});

//Delete
router.get('/deletar', function(req,res){
  var id = req.query.id;
  Produtos.findByIdAndRemove(id,function(err){
    if(err){
     console.log("Error! " + err.message);
     return err; 
   }else{
    res.redirect("listar");
  }});
});

//JSON
router.get('/getProduto', function(req, res) {
	var id = req.query.produto;
	Produtos.findById(id).lean().exec(
		function (e, docs) {
			res.json({produto:docs});
		});
});

module.exports = router;