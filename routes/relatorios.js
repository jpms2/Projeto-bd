var express = require('express');
var router = express.Router();
var db = require("../db");
var Produtos = db.Mongoose.model('produtocollection', db.ProductSchema, 'produtocollection');
var Pedidos = db.Mongoose.model('pedidocollection', db.PedidoSchema, 'pedidocollection');
var dateFormat = require('dateformat');

router.get('/', function(req, res) {
    var db = require("../db");
    var now = new Date();
    var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var tomorrowStr = dateFormat(tomorrow,"yyyy-mm-dd");

    Pedidos.find({}).lean().exec(
        function (e, docs) {
            res.render('pages/relatorio', { dataInicial: "",dataFinal: tomorrowStr, type:"balance","array": docs }); // lil gambi
    });
});

router.post('/', function(req, res) {
    
	var dataInicial = req.body.dataInicial;
    var dataFinal = req.body.dataFinal;
    var type = req.body.type;
    var sellerName = req.body.sellerName;

    var queryStartDate = dataInicial;
    var queryEndDate = dataFinal;

    if(!dataInicial){
        queryStartDate = new Date("2015-01-01");
    }
    if(!dataFinal){
        queryEndDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    }

	var db = require("../db");
	Pedidos.find({
		data: {
        $gte: queryStartDate,
        $lte: queryEndDate
    	}
	}).lean().exec(
		function (e, docs) {
            if(type == "peaktime"){
                timeArray = [{"time" : "08:00 - 10:00", "qtd" : 0, "totalBought": 0},{"time" : "10:00 - 12:00", "qtd" : 0, "totalBought": 0},{"time" : "12:00 - 14:00", "qtd" : 0, "totalBought": 0},{"time" : "14:00 - 16:00", "qtd" : 0, "totalBought": 0},{"time" : "16:00 - 18:00", "qtd" : 0, "totalBought": 0}];
                for (var i = 0; docs[i] ; i++) {
                    if (docs[i].data.getHours() < 10 && docs[i].data.getHours() >= 8){
                        timeArray[0].qtd++;
                        timeArray[0].totalBought += docs[i].valor
                    }if (docs[i].data.getHours() < 12 && docs[i].data.getHours() >= 10){
                        timeArray[1].qtd++;
                        timeArray[1].totalBought += docs[i].valor
                    }if (docs[i].data.getHours() < 14 && docs[i].data.getHours() >= 12){
                        timeArray[2].qtd++;
                        timeArray[2].totalBought += docs[i].valor
                    }if (docs[i].data.getHours() < 16 && docs[i].data.getHours() >= 14){
                        timeArray[3].qtd++;
                        timeArray[3].totalBought += docs[i].valor
                    }if (docs[i].data.getHours() < 18 && docs[i].data.getHours() >= 16){
                        timeArray[4].qtd++;
                        timeArray[4].totalBought += docs[i].valor
                    }
                }
                res.render('pages/relatorio', { dataInicial: dataInicial,dataFinal: dataFinal, type: type, array: timeArray});
            }else{
                if(!sellerName){
                    res.render('pages/relatorio', { dataInicial: dataInicial,dataFinal: dataFinal, type: type, array: docs});
                }else{
                    response = []
                    for (var i = 0; docs[i] ; i++) {
                        if(docs[i].nomevendedor == sellerName){
                            response.push(docs[i]);
                        }
                    }
                    res.render('pages/relatorio', { dataInicial: dataInicial,dataFinal: dataFinal, type: type, array: response});
                }
            }
	});
});





module.exports = router;