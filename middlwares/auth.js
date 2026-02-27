const jwt = require("jsonwebtoken")
const auth = (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
        // console.log(accessToken);

        if(!accessToken){
            const error = new Error("unauthorized")
            error.statusCode=403
            throw error 
        }


        jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY,(error,decoded)=>{
            if(error){
                const error = new Error("unauthorized")
                error.statusCode = 403
            }else{
                req.email = decoded.email
            }
        })
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = auth 