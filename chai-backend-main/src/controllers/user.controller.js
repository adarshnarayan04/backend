import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; //it can contact will database
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//always res.status().json() when we create a api (even if response is empty --> res.json({}) we have to write this)


const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(); //defined in user.model.js
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //stored the referesh token in database
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
//req : request and res: response

//async handler need the need an async function as parameter (here it is async(req,res) =>{})
//and alsp return an function (req,res,next) => {}
//which is stored in registerUser

//registerUser is an function as (asyncHandler is called with async function as parameter) and return a function which get stored in registerUser

//use post command in postman to check the output ( as in route we use post command for registerUser function)

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email); //can check the ouput  by passing the databy post command in postman (body -> raw -> json)
  //on localhost:8000/api/v1/users/register as register user function is called in this address by route(user.routes.js)
  // console.log(req.body)
  // console.log(req.files)
  // console.log( { fullName, email, username, password } )

  //wrong code as it will not work for undefined fields
  // if (
  //   [fullName, email, username, password].some((field) => field?.trim() === "") //field? check if field is null or undefined if not then do  trim
  // ) {
  //   console.log("All fields are required");
  //   throw new ApiError(400, "All fields are required");
  // }

  //When any field is undefined, the optional chaining operator (?.) ensures that the code does not throw an error.
  // Instead, it will return undefined, which will not satisfy the condition field?.trim() === "" return false
  //[fullName, email, username, password].some((field) => field?.trim() === "") so this will not work for undefined fields

  //this will work for undefined fields
  if (
    [fullName, email, username, password].some(
      (field) => field == undefined || field?.trim() === ""
    ) //field? check if field is null or undefined if not then do  trim else return undefined
  ) {
    console.log("All fields are required");
    throw new ApiError(400, "All fields are required");
  }
  //User.findOne() is used to find the user in database ( User is schema of user and it connected to database)
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //if mulitple pass it in array like done here
    //is anyone of the username or email is same then it will return the user(no need  both to same --> it case of and(both need to be same))
  });
  //by using $ we can use various operators
  //$or: This is a MongoDB logical operator that performs a logical OR operation on an array of one or more expressions
  //and selects the documents that satisfy at least one of the expressions.

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  //in the routes we uploaded the image(in local storage) using upload(middleware) post it to controller (so we access it by req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path; //avatar is an array (as multer return an arary for all fiellds)

  //const coverImageLocalPath = req.files?.coverImage[0]?.path; --> wrong code by sir

  //by gpt(working) --> in above we access the coverImage[0] without checking coverImage exist or not
  //in this we check coverImage is present then check if pos[0] is not null ( as option chaing (?.)) therefore
  // it is coverImage(?.)[0] not coverImage?[0] put . single time (not two time file(?.).coverImage--> one for option chainging and other for accessing)
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  //normal way to write the above code(it works)
  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  //as avatar is required so check if it is there or not
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); //uploaded the image on cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //created an user object using all the data obtained above(as database --> so take time so use await)
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //to handle the error
    email,
    password,
    username: username.toLowerCase(),
  });

  //_id is added by mongodb automatically
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //we wrrte what we do not want to selected (in string) (by default it select all the fields)
  );

  if (!createdUser) {
    //user not created
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //this data goes to frontend/ postman as it response which we send
  return res
    .status(201) //this what is show in postman
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

//---- registerUser function ends here -----------//

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    //find the first entry in database
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  //as user is generated by mongoose so we can use the methods of userSchema(User)
  //user.isPasswordCorrect(password) is a method of userSchema
  //do not use User.isPasswordCorrect(password) as it is not a method of User ,method of User are findOne(),findById() etc
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id//generated by mongoose automatically
  );

  //the data we send to frontend( so removed the password and refreshToken)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"//when dont need this field
  );

  //when we send the cookie we have to set the options
  const options = {
    //we can easily modify the cookie so have to set rules to protect it
    httpOnly: true,
    secure: true,
  };//means it can not modified by frontend by enabling it

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)//"key" ,value ,options
    .cookie("refreshToken", refreshToken, options)//app.use(cookieParser()); so we can use cookie middleware
    .json(//in json we send the ApiResponse constructor(statusCode, data, message = "Success") of ApiResponse.js
      //so it reqiure these fields to generate the response
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {//to logout we dont send any data by postman
  //middleware just uses the cookies data , and generate the data and  send it to logoutUser function
  await User.findByIdAndUpdate(
    req.user._id,// as we call the middleware verifyJWT so we have user object in req
    {
      $unset: {//operator of mongodb
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,//mean return the updated document not the original document
    }
  );
  //, the new option in the findByIdAndUpdate method is a configuration option provided by Mongoose. When set to true,
  // it ensures that the method returns the updated document rather than the original document before the update.

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)//clearing the cookie 
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

//in case our access token is expired then  we can use refresh token to get the new access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    //generate the new access token and refresh token

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);//we get req.user object from middleware verifyJWT
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });//we called the save method so it will hash the password again
  //as passowrd is modified this time so it will call the hash function(bcrypt)

  //as we know user exsist so we can use save method directly  so can use validateBeforeSave: false as we validated it before

  //Mongoose runs validation on a document before saving it.
  // This ensures that the document adheres to the schema's validation rules.
  //Setting validateBeforeSave to false tells Mongoose to skip the validation step and directly save the document to the database


  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  //used middleware , so it  return the user object  --> which we return here
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;//which is send by postman/frontend

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,//by this we findedt the user
    {
      $set: {//set operator of mongodb is used to update the fields
        fullName,//or fullName: fullName both are same
        email: email,
      },
    },
    { new: true }//means do not return the original document return the updated document
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;//by multer middleware we get the file in req.file

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,//find the user by id
    {
      $set: {//update the avatar field usign set operator
        avatar: avatar.url,
      },
    },
    { new: true }//return the updated document not the original document
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;//new image path given by multer middleware
  //frontend send the image and we upload it to storage by multer middleware and get the path of the image

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }
//applyig the aggregate function of mongodb on User schema(so it is local  here)
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },//give me all details of the user which we store in db
    },
    {
      $lookup: {
        from: "subscriptions",//from Subscription model --> as mongodb change the name so it become subscriptions
        localField: "_id",//in user schema(as local)
        foreignField: "channel",//in subscription schema(as foreign)
        as: "subscribers",//name given to it(get automatically added )
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {//adding the fields which we want to add
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {//used cond operator of mongodb
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },//check it is present or not (work with array and object)
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {//ONLY shoe thr variable name which we want to show
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {//due to lookup it return array
    throw new ApiError(404, "channel does not exists");
  }

//the value return goes to fronted as it is respond
  return res
    .status(200)
    .json(//as the aggregrate function return array so we have to access the first element of the array
      //it return an array as we can have mutliple entires return by aggregate function
      //in this case only one entry is returned as username is unique
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        //req.user._id will give us string but in database it is object so we have to convert it to object
        //as we matching the the given field in database
        _id: new mongoose.Types.ObjectId(req.user._id),//in database it is object --> at is convetered by moongose to object ans stored
        //when ise finbyid mogonose automatiically convert it to object and serch it in database
        //we use user._id mongoose will convert it to object to string and give us the string

        //but here no role of monogose so we have to convert it to object
      },
    },
    {
      $lookup: {//user(watchhistory)-->video(owner)-->user
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [//it is subpipeline
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [//subpipeline inside subpipeline
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },//staging inside sublpipline
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,//as aggregate funciton of mongodb return array 
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
