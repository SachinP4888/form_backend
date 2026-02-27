require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

const getConnection = require("./utils/getConnection")
const googleAuth = require("./middlwares/googleAuth")
const userRoutes = require("./routes/user")
const errorHandler = require("./middlwares/errorHandler")

const app = express()

// Trust proxy (REQUIRED for Render secure cookies)
app.set("trust proxy", 1)

// CORS (Frontend URL from env)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Session Configuration (Production Safe)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,          // must be true on Render (HTTPS)
      sameSite: "none"       // required for cross-domain (Vercel + Render)
    }
  })
)

// Passport Setup
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

// Google Login Route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account"
  })
)

// Google Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`
  }),
  googleAuth,
  (req, res) => {
    res.redirect(process.env.CLIENT_URL)
  }
)

// Routes
app.use("/user", userRoutes)

// Error Handler
app.use(errorHandler)

// Database Connection
getConnection()

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})