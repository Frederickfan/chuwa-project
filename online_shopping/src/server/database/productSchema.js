// setup schema => setup modedl => use the model you created to query, update, delete entity in your database 
const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    detail: {
        type: String, 
    }, 
    category: {
        type: String, 
        required: true,
    }, 
    id: {
        type: String, 
        required: true,
    },
    price: {
        type: String, 
        required: true,
    }, 
    imgUrl: {
        type: String, 
    }
},{
    timestamps: true, 
});

module.exports = productSchema;