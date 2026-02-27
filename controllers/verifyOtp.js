const User = require("../models/User")
const genereteToken = require("../utils/generateToken")

const verifyOtp = async(req,res,next)=>{
    const {otp} = req.body

    try {
        const findedUser = await User.findOne({"password_otp.otp":otp})
        if(!findedUser){
            const error = new Error("incorrect Otp")
            error.statusCode = 400
            throw error
        }
        const isExpaire = findedUser?.password_otp.send_time <new Date().getTime()
        
        if(isExpaire){
            const error = new Error("otp expaired")
            error.statusCode = 400
            throw error
        }   

        findedUser.password_otp.otp = null;
        await findedUser.save()

        const accessToken = genereteToken(findedUser.email)
        res.cookie("accessToken",accessToken)

        res.status(200).json({message:"otp verified",status:true})
        
    } catch (error) {
        next(error)
    }
   
}

module.exports = verifyOtp