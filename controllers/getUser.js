const User = require("../models/User");

const getUser = async (req, res, next) => {
  const email = req.email;

    // console.log(email)

  try {
    const findedUser = await User.findOne({email:email});
    res.status(200).json({
      massage: "success",
      status: true,
      user: {name:findedUser.name, email: findedUser.email },

    });
  } catch (error) { 
    next(error);
  }
};
module.exports = getUser