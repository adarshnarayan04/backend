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

//here /api/v1/users/ as act as prefix for all the routes ( app.use("/api/v1/users", userRouter)

//create an route
//router.route("/register").post(registerUser); we want  to add image also so we use upload(form multer) --> act as middleware
//router.route("/register").post(middleware registerUser);

//post command post the data to the server(post is an http method) --> we can access the data by req.body (as done in controller)
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",  // The field name in the form data for the avatar file //name should be same in frontend
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

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
//exporting the router
