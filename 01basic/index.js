require('dotenv').config()//to access env file

//import 'dotenv/config'//new style--> add this("type": "module" in package.json)
const express = require('express')//old style
const app = express()
const port = 4000

//always use / in path
app.get('/', (req, res) => {
    //send the response
  res.send('Hello World!') // get displayed on browser
})
//res : response
//req: request

//put / always in path
app.get('/twitter', (req, res) => {
    res.send('on twitter')
    });

    // to use env file

    //process.env.variable_name ( name should be same as declared in env file)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)//this value get displayed on terminal
})
//it will listen on port 3000

//if we write a new file(then we have to restart the server) ---> relaoding not hapeen automatically(like in vite)
//can use nodemon to restart the server automatically