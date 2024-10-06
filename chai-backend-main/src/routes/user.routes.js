//used to store all the routes
import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
} from "../controllers/user.controller.js"; //importing all the functions from user.controller.js
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); //creating the router

//middileware --> jane se pahle mujhse mil ke jana

//here /api/v1/users/ as act as prefix for all the routes ( app.use("/api/v1/users", userRouter)

//create an route
//router.route("/register").post(registerUser); we want  to add image also so we use upload(form multer) --> act as middleware
//router.route("/register").post(middleware ,registerUser);

// ---------- IMP working of route --------//
//it is req.body as we are receiving the data from the frontend/postman , if it res --> means we are sending the data to the frontend/postman
//post command post the data to the server(post is an http method) --> we can access the data by req.body (as done in controller)
//since it receive the data as post request so we use post method(to send data --> as done in postman by selecting post method)
//if using frontend then also use post method to send data to the server(backend)

//then recieved data form fronted/postman is passed to controller function (as we know is tha req,res,next) as parameter
//parameter value is filled my the recieved data from the frontend/postman automatically by express js
//then controller functoin do the work on the recieved data (like authroization,validation and setting the data in the database)

router.route("/register").post(
  upload.fields([
    //uploads the recieved files from the frontend to local storage(as it is multer middleware) and adds it req object
    //there fore it middleaware , it come bwteen the frontend and controller function and do the task
    {
      name: "avatar", // The field name in the form data for the avatar file //name should be same in frontend
      maxCount: 1, // Maximum number of files allowed for this field
      //avatar field will be array as multer always return an array for fields specified in the upload.fields method, regardless of the maxCount value
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser //controller function(express js automaically provide the parameters req,res,next)
); //actual path is /api/v1/users/register(in web browser localhost:8000/api/v1/users/register)

// How It Works
// Express.js Middleware: When a request is made to the /register endpoint, Express.js processes the middleware functions in the order they are defined.
// File Upload Middleware: The upload.fields([...]) middleware handles file uploads and attaches the files to the req object.
// Controller Function: After the file upload middleware, Express.js calls the registerUser controller function and automatically passes the req, res, and next parameters to it.

router.route("/login").post(loginUser);

//secured routes( as we get here when user is logged in)

router.route("/logout").post(verifyJWT, logoutUser); //verifyJWT is middleware as it run before logoutUser(can give many middleware)
//we created the middleware as when we want to logout we dont have any information about the user
//so used middleware to get the information about the user

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword); //verifyJWT  so that logined user can only change the password
router.route("/current-user").get(verifyJWT, getCurrentUser); //used get as we are getting the data from the server(see from the perspective of frontend)
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
//patch is used as we are updating the account details of the user as we are only updating the user's account details,
//other fields in the user profile remain unchanged. Using PATCH indicates that only the account details are being modified, rather than the entire user profile.
//post update the whole data but patch update the partial data
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar); //two middleware
//here want to upload an single image so used upload.single("avatar") middleware of multer
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
//The PATCH method is used here because you are only updating the user's avatar,
//which is a partial update to the user's profile
// Using PATCH indicates that only the avatar field is being modified, rather than the entire user profile.

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
//exporting the router
