//a request has (err,req,res,next)

// a in db most of this is async function so have to use try catch block to handle the error

//so we create the function  that will handle the asyc function and error ( so we dont have to handle it each time)
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))//catch will run promise is rejected
    }
}
//In summary, catch((err) => next(err)) ensures that any errors occurring in the asynchronous request handler are properly caught and passed to the Express error-handling middleware, allowing for centralized error handling in your application.

export { asyncHandler }

//calling the function inside the function(main function return the output of second function)

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