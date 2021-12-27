const express = require("express")
const path = require("path")
const passport = require("passport")
const bodyParser = require("body-parser")
const GoogleStrategy = require("passport-google-oauth")
const expressSession = require("express-session")

const router = express.Router()
const app = express()

passport.serializeUser((user, done) => {
	done(null, user)
})
passport.deserializeUser((user, done) => {
	done(null, user)
})

passport.use(new GoogleStrategy({
	clientID: '',
	clientSecret: '',
	callbackURL: "https://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
	done(null, profile)
}))

router.route("/google/callback")
	.get(passport.authenticate("google", {
		failureRedirect: "/"
	}), (req, res) => {
		res.redirect("/userListing")
	})

router.route("/google")
	.get(passport.authenticate("google", {
		scope: ["https://www.googleapis.com/auth/plus.login"],
	}))