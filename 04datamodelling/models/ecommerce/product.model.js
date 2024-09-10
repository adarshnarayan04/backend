import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description:{
        type: String,//compulsory field
        required: true
    },
    name:{
        type: String,
        required: true
    },
    productImage:{
        type: String,//we provide it with url of prodcut
        required: true
    },
    price:{
        type: Number,
        default: 0
    },
    stock :{
        default:0,
        type: Number
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
     
    
},{timestamps: true});

export const  Product = mongoose.model('Product',productSchema);