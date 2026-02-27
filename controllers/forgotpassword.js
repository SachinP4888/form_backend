const User= require("../models/User")
const sendMail = require("../utils/sendMails")

const forgotPassword = async(req,res,next)=>{
    const{email} = req.body
    try {
        const findedUser = await User.findOne({email:email})
        if(!findedUser){
            const error = new Error("Incorrect Email")
            error.statusCode = 400
            throw error
        }
        const userOtp = findedUser.password_otp?.otp

        if(userOtp){
            const timeDiff = new Date().getTime() - new Date(findedUser.password_otp.last_attempt).getTime()<=24*60*60*1000
            if(!timeDiff){
                findedUser.password_otp.limit = 5
                await findedUser.save()
            }
            const remmainLimit = findedUser.password_otp.limit ===0
            if(timeDiff && remmainLimit){
                const error = new Error("daily limit reached")
                error.statusCode = 400
                throw error
            }

           
        }
            const otp = Math.floor(Math.random()*900000)+100000
            findedUser.password_otp.otp = otp
            findedUser.password_otp.limit--
            findedUser.password_otp.last_attempt = new Date()
            findedUser.password_otp.send_time = new Date().getTime()+2*60*1000 
            await findedUser.save()

            const data = {
                email:email,
                otp:otp
            }
            const result = await sendMail(data)
            console.log(result)



        res.status(200).json({message:`otp sent at ${email}`,status:true, otp:findedUser.password_otp.otp})
    } catch (error) {
        next(error)
    }
}

module.exports =forgotPassword