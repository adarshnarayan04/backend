//a request has (err,req,res,next)

// a in db most of this is async function so have to use try catch block to handle the error

//so we create the function  that will handle the asyc function and error ( so we dont have to handle it each time the error) 
//like done in apierror
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))//catch will run promise is rejected
    }
}
//In summary, catch((err) => next(err)) ensures that any errors occurring in the asynchronous request handler are properly caught and passed to the Express error-handling middleware, allowing for centralized error handling in your application.
//it uses the dafault express error handler

export { asyncHandler }

//handling the error by own instead of using default express error handler ( so that we can set some fields by own like sucess,status code ), if not express will generate the message and status code
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         return await fn(req, res, next);
//     } catch (error) {
//         let statusCode = error.statusCode || 500;
//         if (statusCode < 100 || statusCode >= 600) {
//             // If the status code is not in the valid range, set it to 500
//             statusCode = 500;
//         }
//         res.status(statusCode).json({
//             statusCode,
//             success: false,
//             message: error.message
//         });
//     }
// };

// export { asyncHandler };

//using async await
// const asyncHandler = (requestHandler) => {
//     return async (req, res, next) => {
//         try {
//             await requestHandler(req, res, next); //as reuestHandler is async function  so return an promise so we have to use await
//         } catch (err) {
//             next(err);
//         }
//     };
// };

// export { asyncHandler };

//---------working of asyncHandler---------

// Here's a breakdown of how it works:

// asyncHandler takes a requestHandler function as an argument.
// It returns a new function that takes req, res, and next as arguments.
// Inside this new function, Promise.resolve(requestHandler(req, res, next)) is used to handle the requestHandler function, which might return a promise.
// If the promise is rejected (i.e., an error occurs), the .catch((err) => next(err)) part ensures that the error is passed to the next function, which is the Express error-handling middleware.

// //calling the function inside the function(main function return the output of second function)

//func traversal(dfs) --> dfs function is passed as paramter 
// {
//     return dfs(child)
// }



// const asyncHandler = () => {} ---> normal function
// const asyncHandler = (func) => () => {} ----> higher order function
// const asyncHandler = (func) => async () => {} ---> func is passed to async function as parameter 

// can thing ask (func) => { return async () => {}}  --> called the another function inside the function

//main functon is (func)=>{}  --> inside this function another function is called (async () => {})

    //async function have req,res,next as parameter

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }