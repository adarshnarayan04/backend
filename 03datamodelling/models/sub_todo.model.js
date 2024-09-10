import mongoose from "mongoose";

const subTodoShema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    cratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true});

// cratedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', //can also add comma here create no problem but not good practice
// }, //can also add here but not good practice(as it end of the object --> does ont have comma)
export const SubTodo = mongoose.model('SubTodo',subTodoShema);