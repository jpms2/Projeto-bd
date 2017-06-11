var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');

router.get('/', function(req, res) {
 var db = require("../db");
 Produtos.find({}).lean().exec(
  function (e, docs) {
    res.render('pages/pedidos', { "produtos": docs });
  });
});

router.post('/registrarPedido', function(req, res) {
	var id = req.query.id;
	var nome = req.query.nome;
	var quantidade = parseInt(req.query.quantidade);
	var valor = parseInt(req.query.valor);
	var now = new Date;
	var quantidadeproduto = parseInt(req.query.quantidadeproduto);
	var pedido = new Pedidos({ produtoid: id, nomeproduto: nome, quantidade: quantidade, valor: valor,	data: now });
	pedido.save(function (err) {
		if (err) {
			console.log("Error! " + err.message);
			return err;
		}
		else{
			var quantidadefinal = quantidadeproduto - quantidade
			if (quantidadefinal <= 0){
				quantidadefinal = 0;
			}
			Produtos.findByIdAndUpdate(id, {$set: {
				availableQtd: quantidadefinal }}, function (err) {
				if (err) {
					console.log("Error! " + err.message);
					return err;
				}
				else{
					console.log("Post edited");
					res.redirect("listar");
				}
				});
			console.log("Post saved");
		}
	});
});

module.exports = router;