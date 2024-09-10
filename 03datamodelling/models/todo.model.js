import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema( {
    content: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,//it want to access the database variable (then type this) then give the ref
        ref: 'User',//same as name given to mode ('User',userSchema)--> User is the name
    
    },
    subTodos: [
        {
           type: mongoose.Schmma.Types.ObjectId,
           ref: 'SubTodo',
        }
    ],//array of subtodo
},{timestamps: true});

export const Todo = mongoose.model('Todo', todoSchema);
//name in datbase will be "todos" 