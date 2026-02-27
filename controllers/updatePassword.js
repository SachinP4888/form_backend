const User = require("../models/User");
const bcrypt = require("bcrypt");

const updatePassword = async (req, res, next) => {
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const findedUser = await User.findOne({ email: req.email });
    findedUser.password = hashedPassword;
    await findedUser.save();
    res.clearCookie("accessToken");
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "password update", status: true });
  } catch (error) {
    next(error);
  }
};
module.exports = updatePassword
