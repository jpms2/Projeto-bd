var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');


/* Redirects to pedidos */
router.get('/', function(req, res, next) {
	res.redirect('/pedidos');
});

module.exports = router;
