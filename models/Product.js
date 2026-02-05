const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    }, price: {
        type: Number,
        required: true,
    }, bestseller: {
        type: Boolean,
        required: true
    }, offer: {
        type: String,
        default: false
    }, category: {
        type: [
            {
                type: String,
                enum: ["veg", "non-veg"]
            }
        ],
        required:true
    },image:{
        type:String
    },description:{
        type:String,
        default:false
    },firm:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Firm'
        }
    ]
})
module.exports=mongoose.model('product',productSchema);
