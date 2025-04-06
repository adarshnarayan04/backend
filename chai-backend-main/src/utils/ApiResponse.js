//write in same in another project

//this data goes to fronted as it response
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode// store HTTP status code ( of no use , can remov it also )
        this.data = data//Stores the data payload. 
        this.message = message//stores the message about the response.
        this.success = statusCode < 400 // Set to true if the status code is less than 400, indicating that the operation was successful.
    }
}

//actual statuscode is res.status(statusCode) --> this one, but we can access it value in frontend

export { ApiResponse }

//structure of response object of axios (frontend) 
// {
//     // `data` is the response that was provided by the server
//     data: {},
  
//     // `status` is the HTTP status code from the server response
//     status: 200,
  
//     // `statusText` is the HTTP status message from the server response
//     // As of HTTP/2 status text is blank or unsupported.
//     // (HTTP/2 RFC: https://www.rfc-editor.org/rfc/rfc7540#section-8.1.2.4)
//     statusText: 'OK',
  
//     // `headers` the HTTP headers that the server responded with
//     // All header names are lower cased and can be accessed using the bracket notation.
//     // Example: `response.headers['content-type']`
//     headers: {},
  
//     // `config` is the config that was provided to `axios` for the request
//     config: {},
  
//     // `request` is the request that generated this response
//     // It is the last ClientRequest instance in node.js (in redirects)
//     // and an XMLHttpRequest instance in the browser
//     request: {}
//   }

//const res= await axios.post("/api/getuser")
//all the data send by backend will be here(object,success,message), also statusCode
//so to access data in fronted res.data.data ( as we are sending data in data field of ApiResponse class)

// if send by req.status(200).json( user,message:"Success") --> then
//to access user --> res.data , but we sending like req.status(200).json({user,message:"Success"})
//so to access user --> res.data.user

//to access message --> res.data.message
//to access success --> res.data.success

//but no need of add statusCode of axios already give it by res.staus, then why use res.data.statusCode