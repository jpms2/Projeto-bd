var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('pages/helloworld', { title: 'Hello, World!' });
});


router.get('/getProduto', function(req, res) {
	var id = req.query.produto;
	Produtos.findById(id).lean().exec(
		function (e, docs) {
			res.json({produto:docs});
			//res.json({price : docs.price, qtd : docs.availableQtd});
		});
});

router.get('/relatorio', function(req, res) {
	var db = require("../db");
	Pedidos.find({}).lean().exec(
		function (e, docs) {
			res.render('pages/relatorio', { "pedidos": docs });
	});
});

router.post('/relatorio', function(req, res) {
	var dataInicial = req.body.dataInicial;
	var dataFinal = req.body.dataFinal;
	var db = require("../db");
	Pedidos.find({
		data: {
        $gte: dataInicial,
        $lt: dataFinal
    }
	}).lean().exec(
		function (e, docs) {
			res.render('pages/relatorio', { "pedidos": docs });
	});
});


module.exports = router;
