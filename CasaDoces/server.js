var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var request    = require('request');
var HashMap    = require('hashmap');
var schedule   = require('node-schedule');
var monk = require('monk');
var db = monk('localhost:27017/database');
var productCollection = db.get('productCollection');
var saleCollection = db.get('saleCollection');

mongoose.connect('mongodb://localhost/api', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var product = mongoose.Schema({
    id : Number,
    name : String,
    price : Number,
    availableQtd : Number
});

var sale = mongoose.Schema({
    id : Number,
    quantity : String,
    date : String,
    time : String,
    product : {id : Number,
               name : String,
               price : Number,
               availableQtd : Number}
});

var productSchema = mongoose.model('Product', product);
var saleSchema = mongoose.model('Sale', sale);

productSchema.find(function (err, ids){
    if (err) return console.error(err);
    var idsCollection;
    productCollection.find({},{},function(e,docs){
        idsCollection = docs;
        if( idsCollection.length > 0)
        {
            console.log("Retrieving products from database...");
        }
        else
        {
            return console.log("No products found in the database");
        }
    });
});

saleSchema.find(function (err, ids){
    if (err) return console.error(err);
    var idsCollection;
    saleCollection.find({},{},function(e,docs){
        idsCollection = docs;
        if( idsCollection.length > 0)
        {
            console.log("Retrieving sales from database...");
        }
        else
        {
            return console.log("No sales found in the database");
        }
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req,res,next){
    req.db = db;
    next();
});

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/get', function(request, response){
    response.json({message : 'hooray! welcome to our api!'});
});

router.post('/addProduct', function(req,res){
    notNew = false;
    productCollection.find({}, function (err, docs) {
        for (var i = 0; docs[i]; i++) {
            if (docs[i].id === req.body.id) {
                var existingProd = docs[i];
                notNew = true;
            }
        }
        if(notNew){
            availableQtd = parseInt(req.body.availableQtd, 10) + parseInt(existingProd.availableQtd, 10);
            productCollection.remove({"id": existingProd.id}, function(err, user) {
                if (err) throw err;
            });
            id = existingProd.id;
            name = existingProd.name;
            price = existingProd.price;
        }else{
            id = req.body.id;
            name = req.body.name;
            price = req.body.price;
            availableQtd = req.body.availableQtd;
        }
        var collection = db.get('productCollection');
        collection.insert({
            "id" : id,
            "name" : name,
            "price" : price,
            "availableQtd" : availableQtd
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                console.log("There was a problem adding the information to the database.");
            }else{
                res.json("Product added with success")
            }
        });
    });
});

router.post('/addSale', function(req,res){
    var id = req.body.id;
    var quantity = req.body.quantity;
    var product = req.body.product;
    var collection = db.get('saleCollection');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    collection.insert({
        "id" : id,
        "quantity" : quantity,
        "date" : date,
        "time" : time,
        "product" : product
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            console.log("There was a problem adding the information to the database.");
        }else{
            updateStock(id);
            res.json("Sale added with success")
        }
    });
});

function updateStock (id) {
    saleCollection.find({}, function (err, docs) {
        for (var i = 0; docs[i]; i++) {
            console.log(docs[i]);
            if (docs[i].id === id) {
                sale = docs[i];
            }
        }
        outdatedProd = sale.product;
        id = outdatedProd.id;
        name = outdatedProd.name;
        price = outdatedProd.price;
        availableQtd = parseInt(outdatedProd.availableQtd, 10) - parseInt(sale.quantity, 10);
        productCollection.remove({"id": id}, function(err, user) {
            if (err) throw err;
        });
        productCollection.insert({
            "id" : id,
            "name" : name,
            "price" : price,
            "availableQtd" : availableQtd
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                console.log("There was a problem updating the stock.");
            }
        });
    });
}

router.post('/removeProduct',function (req,res) {
    notNew = false;
    productCollection.find({}, function (err, docs) {
        for (var i = 0; docs[i]; i++) {
            if (docs[i].id === req.body.id) {
                existingProd = docs[i];
            }
        }
        var id = req.body.id;
        var quantity = req.body.removeQtd;

        if(existingProd.availableQtd <= quantity){
            productCollection.remove({"id": id}, function(err, user) {
                if (err){
                    console.log("There was a problem removing the product.");
                }else{
                    res.json("Product removed with success");
                }
            });
        }else{
            availableQtd = parseInt(existingProd.availableQtd, 10) - parseInt(req.body.removeQtd, 10);
            productCollection.remove({"id": id}, function(err, user) {
                if (err) throw err;
            });
            productCollection.insert({
                "id" : existingProd.id,
                "name" : existingProd.name,
                "price" : existingProd.price,
                "availableQtd" : availableQtd
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    console.log("There was a problem updating the stock.");
                }else{
                    res.json("Product stock updated with success")
                }
            });

        }
        var collection = db.get('productCollection');
    });
});

router.post('/editProduct',function (req,res) {
    productCollection.find({}, function (err, docs) {
        for (var i = 0; docs[i]; i++) {
            if (docs[i].id === req.body.id) {
                existingProd = docs[i];
            }
        }
        var name = req.body.name;
        var price = req.body.price;
            productCollection.remove({"id": existingProd.id}, function(err, user) {
                if (err) throw err;
            });
            productCollection.insert({
                "id" : existingProd.id,
                "name" : name,
                "price" : price,
                "availableQtd" : existingProd.availableQtd
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    console.log("There was a problem updating the product.");
                }else{
                    res.json("Product updated with success")
                }
            });
        var collection = db.get('productCollection');
    });
});

router.get('/stockBalance',function (req,res) {
    productCollection.find({}, function (err, docs) {
        allStock = [];
        for (var i = 0; i < docs.length; i++) {
            allStock.push({"name" : docs[i].name,"qtd" : docs[i].availableQtd});
        }
        res.json(allStock);
    });
});

router.post('/salesBalance',function (req,res) {
    saleCollection.find({}, function (err, docs) {
        allSales = [];
        for (var i = 0; docs[i] ; i++) {
            if((req.body.date1).match(/[^-]*/g)[0] <= (docs[i].date).match(/[^-]*/g)[0] &&  (req.body.date2).match(/[^-]*/g)[0] >= (docs[i].date).match(/[^-]*/g)[0]){
                if((req.body.date1).match(/[^-]*/g)[2] < (docs[i].date).match(/[^-]*/g)[2] &&  (req.body.date2).match(/[^-]*/g)[2] > (docs[i].date).match(/[^-]*/g)[2]){
                    allSales.push({"name" : docs[i].product.name, "qtd" : docs[i].quantity})
                }else{
                    if((req.body.date1).match(/[^-]*/g)[4] <= (docs[i].date).match(/[^-]*/g)[4] &&  (req.body.date2).match(/[^-]*/g)[4] >= (docs[i].date).match(/[^-]*/g)[4]){
                        allSales.push({"name" : docs[i].product.name, "qtd" : docs[i].quantity})
                    }
                }
            }
        }
        res.json(allSales);
    });
});

router.post('/peakBalance',function (req,res) {
    saleCollection.find({}, function (err,docs) {
        timeArray = [{"time" : "00:00-06:00", "qtd" : 0},{"time" : "06:00-12:00", "qtd" : 0},{"time" : "12:00-18:00", "qtd" : 0},{"time" : "18:00-24:00", "qtd" : 0}];
        for (var i = 0; docs[i] ; i++) {
            if((req.body.date1).match(/[^-]*/g)[0] <= (docs[i].date).match(/[^-]*/g)[0] &&  (req.body.date2).match(/[^-]*/g)[0] >= (docs[i].date).match(/[^-]*/g)[0]){
                if((req.body.date1).match(/[^-]*/g)[2] < (docs[i].date).match(/[^-]*/g)[2] &&  (req.body.date2).match(/[^-]*/g)[2] > (docs[i].date).match(/[^-]*/g)[2]){
                    if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 6){
                        timeArray[0].qtd++;
                    }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 12 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 6){
                        timeArray[1].qtd++;
                    }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 18 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 12){
                        timeArray[2].qtd++;
                    }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 24 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 18){
                        timeArray[3].qtd++;
                    }
                }else{
                    if((req.body.date1).match(/[^-]*/g)[4] <= (docs[i].date).match(/[^-]*/g)[4] &&  (req.body.date2).match(/[^-]*/g)[4] >= (docs[i].date).match(/[^-]*/g)[4]){
                        if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 6){
                            timeArray[0].qtd++;
                        }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 12 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 6){
                            timeArray[1].qtd++;
                        }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 18 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 12){
                            timeArray[2].qtd++;
                        }if (parseInt((docs[i].time).match(/[^:]*/g)[0], 10) < 24 && parseInt((docs[i].time).match(/[^:]*/g)[0], 10) >= 18){
                            timeArray[3].qtd++;
                        }
                    }
                }
            }
        }
        res.json(timeArray);
    });
});


app.use('/database', router);

app.listen(port);

console.log('Magic happens on port ' + port);