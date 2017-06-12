var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');
var Vendedores = db.Mongoose.model('vendedorcollection', db.SellerSchema, 'vendedorcollection');

router.get('/', function(req, res) {
 var db = require("../db");
 Produtos.find({}).lean().exec(
  function (e, docs) {
    Vendedores.find({}).lean().exec(
	  function (e, docss) {
		res.render('pages/pedidos', { "produtos": docs, "vendedores": docss });
	  });
  });
});

router.post('/registrarPedido', function(req, res) {
	var produtos = req.body.message;
	var vendedor = req.body.vendedor; // era para ser o id aqui, ta com o nome
	var now = new Date();

	produtos.forEach(function(element, index){
		var quantidadeproduto;
		Produtos.findById(element.id,function(err,user){
			quantidadeproduto = user.availableQtd;
		});

		var pedido = new Pedidos({ produtoid: element.id,  nomevendedor : vendedor, 
			nomeproduto: element.nome, quantidade: element.quantidade, 
			valor: element.valor,data: now });

		pedido.save(function (err) {
			if (err) {
				return err;
			}else{
				var quantidadefinal = quantidadeproduto - element.quantidade;
				if (quantidadefinal <= 0){
					quantidadefinal = 0;
				}
				Produtos.findByIdAndUpdate(element.id, {$set: {
					availableQtd: quantidadefinal }}, function (err) {
						if (err) {
							console.log("Error! " + err.message);
							return err;
						}
					});
			}
		});
	});
	res.status(200).send(200,"Pedido Salvo");
});

module.exports = router;