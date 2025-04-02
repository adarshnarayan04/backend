// require('dotenv').config({path: './.env'}) //not used

import dotenv from "dotenv"; //if use import then have to write dotenv.config({path: './env'})  in code
//"dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js" also this is added in 'nodemon src/index.js'
import connectDB from "./db/index.js";
import { app } from "./app.js"; //write .js always else will give error
//we have created app in app.js and exported it and imported it here(const app = express())
dotenv.config({
  path: "./.env",
});

//connectDB() is a async function so can use --> so calling it retuurn a promise (can use .then () and .catch())
//procoes.env.PORT is used to get the port number from .env file but in production it will be provided by the hosting provider
// so we write process.env.PORT  if that port in not available then production will provide use re write the process.env.PORT
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

//can also write app.listen(process.env.PORT || 8000) only, it will work fine
//by adding callback function we know when the server is started as it will print the message

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
