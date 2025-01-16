import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//install cors and cookie-parser from npm

const app = express();

//app.use is used to use middleware and configuration settings
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//have to write this 4 line code(to recieve data form vaious thing(like forn ,json,image,url))

app.use(express.json({ limit: "16kb" }));//so that we can recieve json data(  ex: in post request req.body generally cointain json data  --> will give undefined if we dont use this)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url encoder
app.use(express.static("public"));
//pulbic folder is used to store images pdf,and files that are used
app.use(cookieParser());//it is middleware to parse the cookie

//routes import
import userRouter from "./routes/user.routes.js"; //as it was default export so we can give any name
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

//routes declaration

//earlier we use app.get() --> as we write the routes and controller in the same file
// app.get('/twitter', (req, res) => {
//     res.send('on twitter')
//     });

//but now we use app.use() (it is middleware) --> as we write the routes and controller in different file
//route is /api/v1/users and  userRouter cointain all the routes so when we hit /api/v1/users/.... it then call the userController

//now  /api/v1/users/ it will take you to userRouter
//v1 stands for version 1

//then is inside the route of userRouter we have other routes like /register, /login etc which call the contoller function
//path--> router --> controller function(called by route inside the router)
//v1 stands for version 1

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/users/register --> access the register route of userRouter

export { app };
