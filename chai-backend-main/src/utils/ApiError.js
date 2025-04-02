//it extends the Error class(so ApiError inherites all the properties of Error class)

//write this code as it is in another project
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",//default value of parameter
        errors = [],
        stack = ""//this are the parameter of construcxtor class
    ){
        super(message)//have to write it (call the constructor of parent class)
        this.statusCode = statusCode //The HTTP status code associated with the error.
        this.data = null //Initialized to null. This can be used to store additional data related to the error.
        this.message = message// descriptive message about the error.
        this.success = false;//Set to false to indicate that the operation was not successful.
        this.errors = errors//array to hold multiple error messages or details

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
        //If a stack parameter is provided, it sets this.stack to the provided stack trace.
         //If no stack is provided, it captures the current stack trace using Error.captureStackTrace. This method creates a .stack property on the error instance that contains the stack trace at the point where the error was instantiated

    }
}
//here write construcotr of ApiError class
//constructor(statusCode,message,errors,stack){

//}

export {ApiError}

// When the following line runs:
//throw new ApiError(409, "User with email or username already exists");
// this is what happens:

// The async function in the route throws the ApiError.
// Since the function is wrapped with asyncHandler, the thrown error causes the returned Promise to be rejected.
// The rejection is caught by the .catch((err) => next(err)) in asyncHandler.
// The error is passed to Express's next() function, which then hands it off to the error-handling middleware (custom if defined, otherwise Express’s default error handler).

//the following happens:
// The error is created as an instance of ApiError, which includes the status code and the message.
// This error is thrown inside an async function wrapped by asyncHandler.
// Within asyncHandler, the promise rejection is caught by the catch block that calls next(err), passing the ApiError instance (including its message) to Express's error-handling middleware.