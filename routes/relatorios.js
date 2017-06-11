var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');
var dateFormat = require('dateformat');

router.get('/', function(req, res) {
    var db = require("../db");
    var now = new Date();
    var today = dateFormat("yyyy-mm-dd");	
    Pedidos.find({}).lean().exec(
        function (e, docs) {
            res.render('pages/relatorio', { dataInicial: "",dataFinal: today, type:"balance","array": docs }); // lil gambi
    });
});

router.post('/', function(req, res) {
	var dataInicial = req.body.dataInicial;
	var dataFinal = req.body.dataFinal;
    var type = req.body.type;
	var db = require("../db");
	Pedidos.find({
		data: {
        $gte: dataInicial,
        $lte: dataFinal
    	}
	}).lean().exec(
		function (e, docs) {
            if(type == "peaktime"){
                pricesArray = [0,0,0,0,0]
                timeArray = [{"time" : "08:00 - 10:00", "qtd" : 0},{"time" : "10:00 - 12:00", "qtd" : 0},{"time" : "12:00 - 14:00", "qtd" : 0},{"time" : "14:00 - 16:00", "qtd" : 0},{"time" : "16:00 - 18:00", "qtd" : 0}];
                for (var i = 0; docs[i] ; i++) {
                    if (docs[i].data.getHours() < 10){
                        timeArray[0].qtd++;
                        pricesArray[0] += docs[i].valor
                    }if (docs[i].data.getHours() < 12 && docs[i].data.getHours() >= 10){
                        timeArray[1].qtd++;
                        pricesArray[1] += docs[i].valor
                    }if (docs[i].data.getHours() < 14 && docs[i].data.getHours() >= 12){
                        timeArray[2].qtd++;
                        pricesArray[2] += docs[i].valor
                    }if (docs[i].data.getHours() < 16 && docs[i].data.getHours() >= 18){
                        timeArray[3].qtd++;
                        pricesArray[3] += docs[i].valor
                    }if (docs[i].data.getHours() < 18 && docs[i].data.getHours() >= 16){
                        timeArray[4].qtd++;
                        pricesArray[4] += docs[i].valor
                    }
                }
                res.render('pages/relatorio', { dataInicial: dataInicial,dataFinal: dataFinal, type: type, array: timeArray, pricesArray: pricesArray});
            }else{
                res.render('pages/relatorio', { dataInicial: dataInicial,dataFinal: dataFinal, type: type, array: docs});
            }
	});
});





module.exports = router;