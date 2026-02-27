const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findedUser = await User.findOne({ email: email });
    if (!findedUser) {
      const error = new Error("no user found");
      error.statusCode = 400;
      throw error;
    }

    const isPassMatch = await bcrypt.compare(password, findedUser.password);
    if (!isPassMatch) {
      const error = new Error("incorrect password");
      error.statusCode = 400;
      throw error;
    }
    const accessToken = generateToken(findedUser.email);
    res.cookie("accessToken", accessToken, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({message:"success",status:true})
  } catch (error) {
    next(error);
  }
};

module.exports = login