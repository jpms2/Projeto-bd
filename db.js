var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/casadoces');

var productSchema = new mongoose.Schema({
    id : Number,
    name : String,
    price : Number,
    availableQtd : Number
}, { collection: 'produtocollection' });

var saleSchema = new mongoose.Schema({
    id : Number,
    quantity : String,
    date : String,
    time : String,
    product : {id : Number,
               name : String,
               price : Number,
               availableQtd : Number}
}, { collection: 'vendacollection' });

var sellerSchema = new mongoose.Schema({
    nome: String
}, { collection: 'vendedorcollection' });


module.exports = { Mongoose: mongoose, SellerSchema: sellerSchema, SaleSchema: saleSchema, ProductSchema : productSchema}