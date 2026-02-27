const express = require("express");
const register = require("../controllers/register");
const login = require("../controllers/login")
const getUser = require("../controllers/getUser")
const auth = require("../middlwares/auth")
const logout = require("../controllers/logout")
const getAccess = require("../controllers/getAccess");
const forgotPassword = require("../controllers/forgotpassword");
const verifyOtp = require("../controllers/verifyOtp")
const getTime = require("../controllers/getTime")
const updatePassword = require("../controllers/updatePassword")

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile",auth,getUser)
router.get("/logout",logout)  
router.get("/access", auth, getAccess);
router.post("/password/forgot",forgotPassword);
router.post("/otp/verify", verifyOtp);
router.post("/otp/time", getTime);
router.post("/password/update",auth,updatePassword)




module.exports = router;
