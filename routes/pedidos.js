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
	var produtos = req.body;
	var now = new Date;
	produtos.forEach(function(element, index){
		var pedido = new Pedidos({ produtoid: element.id, nomeproduto: element.nome, quantidade: element.quantidade, valor: element.valor,	data: now });
		pedido.save(function (err) {
			if (err) {
				console.log("Error! " + err.message);
				return err;
			}
		});
	});
	res.status(200).send(200,"Pedido Salvo");
});

module.exports = router;