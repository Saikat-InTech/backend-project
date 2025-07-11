class ApiError extends Error{
    constructor(
        statusCode,
        message="somthing went wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statuscode=statusCode
        this.data=null
        this.message=message
        this.success= false
        this.error=error

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}