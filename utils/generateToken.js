const jwt = require("jsonwebtoken");

const genereteToken = (email) => {
  const accessToken = jwt.sign(
    { email:email},
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: "7d" },
  );

  return accessToken;
};
module.exports = genereteToken;
 