const User = require("../models/User")

const getTime = async (req,res,next)=>{
    
    
    const {email} = req.body 
    try {
        const findedUser = await User.findOne({email:email})
        if(!findedUser){
            const error = new Error("something went wrong")
            error.statusCode = 400
            throw error
        }
        const time = findedUser.password_otp.send_time
        res.status(200).json({message:"otp sent",status:true,time})
    } catch (error) {
        next(error)
    }
}

module.exports = getTime