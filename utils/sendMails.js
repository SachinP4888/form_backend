const nodemailer = require("nodemailer")
const sendMail =  async(data)=>{
    try {
        const transport = nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:"sachin.pahade88@gmail.com",
                pass:process.env.APP_PASSWORD
            }
        })
        const stringOtp = data.otp.toString()
        const mailOption = {
            from:"sachin.pahade88@gmail.com",
            to:data.email,
            subject:"password otp",
            text:stringOtp
        }
        const result  =  await transport.sendMail(mailOption)
        return result
        
    } catch (error) {
        console.log(error)
    }
}
module.exports = sendMail