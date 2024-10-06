//write in same in another project

//this data goes to fronted as it response
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode// store HTTP status code
        this.data = data//Stores the data payload.
        this.message = message//stores the message about the response.
        this.success = statusCode < 400 // Set to true if the status code is less than 400, indicating that the operation was successful.
    }
}

export { ApiResponse }