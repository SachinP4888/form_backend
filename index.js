require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport =require("passport")
const GoogleStategy = require("passport-google-oauth20").Strategy
const getConnection = require("./utils/getConnection")
const googleAuth = require("./middlwares/googleAuth")
const userRoutes = require("./routes/user")
const errorHandler = require("./middlwares/errorHandler")


const app = express()

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))
app.use(cookieParser())

// google login config
app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:5050/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    // console.log(profile)
    return done(null,profile)

} ))


passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})

app.get("/auth/google/callback",
    passport.authenticate("google",{
        failureRedirect:"http://localhost:5173/login"
    }),
    googleAuth,
    (req,res,next)=>{
        res.redirect("http://localhost:5173/")
    }
)



app.get("/auth/google",passport.authenticate("google",{
    scope:["email","profile"],
    prompt:"select_account"
}))

app.use("/user",userRoutes)

app.use(errorHandler)
getConnection()

app.listen(process.env.PORT,()=>console.log(`server is running: ${process.env.PORT}`))