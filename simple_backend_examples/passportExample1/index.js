const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")
const users = require("./users")
const port = process.env.PORT || 3000 // PORT=5050 node app

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.use(require("express-session")({
	secret: "some random strings",
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//add user to session
passport.serializeUser((user, done) => {
	done(null, user)
})
// after Logout take user out from session
passport.deserializeUser((user, done) => {
	done(null, user)
})

passport.use(
	new LocalStrategy({ //default credential are username and password
		usernameField: "email",
		passwordField: "password",
		session: false
	}, (email, password, done) => {
		users.findOne(email, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, { message: "Incorrect email." })
			}
			if (!user.validatePassword(password)) {
				return done(null, false, { message: "Incorrect password." })
			}
			return done(null, user)
		})
	}
))

app.post("/login", passport.authenticate("local", {
	successRedirect: "/success",
	failureRedirect: "/login",
	failureFlash: true
}))

app.get("/success", (req, res) => {
	res.redirect("/")
})

app.get("/login", (req, res) => {
	let errormessage = req.flash("error")
	res.append("errormessage", errormessage)
	res.redirect("/login.html")
})

app.get("/logout", (req, res) => {
	req.logout()
	//this is a passport call
	res.redirect("/")
})


app.post("/addUser", (req, res) => {
	req.logout()
	//this is a passport call

	let firstName = req.body.first
	let lastName = req.body.last
	let email = req.body.email
	let pw = req.body.password
	if (firstName, lastName, email, pw) {
		let newUser = users.createUser(firstName, lastName, email, pw)
		users.addOne(newUser)
		res.redirect("/login")
	}
	else {
		res.redirect("/adduser.html")
	}
})


//Helper function:
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login")
}
//Protect resources. Must be logged in before access
app.get("/getfile", isLoggedIn, (req, res)=> {
	let filepath = path.join(__dirname, "data", "protected.txt")
	res.sendFile(filepath)
})

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})