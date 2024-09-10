import mongoose from "mongoose";

//can write it in differnt file access it byref
//but we use it here only ( so defined it here only)

//no need of timestamps as ordersSchema already have it
const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity:{
        type: Number,
        reqired: true

    }
});

const orderSchema = new mongoose.Schema({
    orderPrice:{
        type: Number,
        required: true
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderItems:{
        type:[orderItemSchema]//can also write in this way( it create an array of items having orderItemSchema)

        //also in this way as studied in 03databasemodelling/models/todo.model.js ( does nnot look good )

        //if multiples variable are there (then make an schema of it and use it)--> like here have productId and quantity

        // type:[
        //     {
        //         productId:{
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'Product',
        //         },
        //         quantity:{
        //             type: Number,
        //             reqired: true
        //         }
        
        //     }
        // ]
    },
    address:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING','CANCELLED','COMPLETED'],//enum gives the option to choose value from these value(if other value if given it will be updated in datebase)
        default: 'PENDING'
    }
},{timestamps: true});


export const Order = mongoose.model('Order',orderSchema);