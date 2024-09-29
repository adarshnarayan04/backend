import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req, res) => {
    res.status(400).json({
        message: "chai aur code"
    })//this respond to the client( cointains the status code and the json data)

    const { fullName, email, username, password } = req.body;
    console.log("email: ", email);
} )


export {
    registerUser,
}