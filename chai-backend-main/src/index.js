// require('dotenv').config({path: './.env'}) //not used

import dotenv from "dotenv"//if use import then have to write dotenv.config({path: './env'})  in code
//"dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js" also this is added in 'nodemon src/index.js'
import connectDB from "./db/index.js";
import {app} from './app.js'//write .js always else will give error
//we have created app in app.js and exported it and imported it here(const app = express())
dotenv.config({
    path: './.env'
})


//connectDB() is a async function so can use --> so calling it retuurn a promise (can use .then () and .catch())
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

0








/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/