import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

//this middleware is used to verify the jwt token (this middleware is created by us)
export const verifyJWT = asyncHandler(async(req, _, next) => {//written _ instead of res as we are not using res in this middleware
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //can send by postman in header section 
        //can see it in docs of jwt token  Authorization: Bearer <token> ( key =Authorization and value = Bearer <token>)
        //so we reoved "Bearer " from the token now we have only token which we want
        //there is space between Bearer and token so we wrote "Bearer " so we have to remove the space also

        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//dedcoded the token using secret key
        //decoded token will have all the data that we have passed in the token when we created the token
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;//in the request object we are adding the user object so that we can use it in the next middleware
        //as middleware is 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
        //this error will be handled by the catch of aynsc handler

        //When an error is re-thrown inside the catch block
        //it will propagate out of that function. If the function is wrapped by asyncHandler, that re-thrown error ends up being caught by asyncHandler’s catch block (i.e. the .catch((err) => next(err)) part) and passed to Express's error-handling middleware.
    }
    
})
//Even though the asyncHandler catches asynchronous errors overall, the try-catch inside verifyJWT is used to customize error handling.
// For example, jwt.verify can throw synchronous errors, and the try-catch lets you catch those errors and wrap them into a custom ApiError with a specific status code/message before letting asyncHandler pass it to Express's middleware. 
// This gives you finer control over the error responses.


//If you remove the try-catch block:
// Any synchronous error (like one thrown by jwt.verify) would bubble up and still be caught by asyncHandler.
// However, you would lose the opportunity to wrap these errors in your custom ApiError with a specific status code and message (e.g., converting a generic JWT error into a 401 "Invalid access token" error).
// Without try-catch, the raw error gets passed on to the next middleware, which might not provide the desired error format or status.
//means we dont have control on the status code and error message , in case any error occur