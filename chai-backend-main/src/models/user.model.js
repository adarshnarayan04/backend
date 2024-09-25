import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"//used to encrpyt the data
import bcrypt from "bcrypt"//used to hash the password

//hashing is one way process so we can not decrypt the password from the hash
//to campare the password we compare hash of the given password with the hash of the orginial password

//hash function9 generate same hash for same string

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true//is you want to use an partucular field to search ( use index: true is make the search faster)
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']//custom error mesaage ( when we use require: true --> can use this)
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)
//pre hook will run just before we save(or other operation) the data
//"save" is the operation that we are going to perform(can write other opeation also)

//can not use arrow function here because we are using this keyword(in arrow function this keyword points to the parent scope)
//but we wahnt to use this keyword of userSchema (so normal function is used)

userSchema.pre("save", async function (next) {

    //as whenever someone update the profile then password will be hashed again so we have to check if password is modified or not
    //value should be in string so use "password"
    if(!this.isModified("password")) return next();//as middleware so have to call next() to move to next middleware

    this.password = await bcrypt.hash(this.password, 10)//10 is the number of rounds of hashing
    next()
})

//defined the custome method isPasswordCorrect in userSchema 
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)//bcrypt also have compare method to compare the password(so we can check password is true or not)
    //it compare the hash of both password
}

//https://jwt.io/   --> to visilaize the token of jwt
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },//this payload of token (it store the data)
        process.env.ACCESS_TOKEN_SECRET,//it is secret key to encrypt the data(so used when we decrypt the data  to check the data is correct or not) --> use access_token as haed as possible
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//to generate the refresh token we use same method as access token(but here payload is less)
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)