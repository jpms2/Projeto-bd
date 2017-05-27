var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.ProductSchema, 'pedidocollection');

router.get('/', function(req, res) {
 var db = require("../db");
 Produtos.find({}).lean().exec(
  function (e, docs) {
    res.render('pages/pedidos', { "produtos": docs });
  });
});

module.exports = router;