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