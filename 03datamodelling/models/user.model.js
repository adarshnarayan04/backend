//we generally write abc.model.js or abc.models.js (not complusory but it a good practice)
import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//     {
//         username: String,
//         email: String,
//         isActive: Boolean
//     }
// );

// or new method
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password:{
            type: String,
            required: [true,"password is required"]//is not true this message will be shown
        }
        
    },{timestamps: true}//it will add the time of creation and updation(it is timestamps not timestamp --> it has two thing creation and updation time)
        
)
//we are creating an modeil based on the schema
export const User = mongoose.model('User', userSchema);

//during exprort write it int capital letter

//if model name "User" then in database it will be "users" in plural form (in lower case and add 's in back of it)