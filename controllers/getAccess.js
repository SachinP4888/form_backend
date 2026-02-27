const getAccess =  async(req,res,next)=>{
    res.status(200).json({mssage:"success",status:true})

}
module.exports = getAccess
