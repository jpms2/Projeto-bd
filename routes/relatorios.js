var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');

router.post('/relatorioHorarioPico', function(req, res) {
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
			timeArray = [{"time" : "00:00 - 06:00", "qtd" : 0},{"time" : "06:00 - 12:00", "qtd" : 0},{"time" : "12:00 - 18:00", "qtd" : 0},{"time" : "18:00 - 24:00", "qtd" : 0}];
         for (var i = 0; docs[i] ; i++) {
         	if (docs[i].data.getHours() < 6){
                timeArray[0].qtd++;
            }if (docs[i].data.getHours() < 12 && docs[i].data.getHours() >= 6){
                timeArray[1].qtd++;
            }if (docs[i].data.getHours() < 18 && docs[i].data.getHours() >= 12){
                timeArray[2].qtd++;
            }if (docs[i].data.getHours() < 24 && docs[i].data.getHours() >= 18){
                timeArray[3].qtd++;
                     }
         }
			res.render('pages/relatorio', { "pedidos": timeArray });
	});
});





module.exports = router;