const express = require("express")
const session = require("express-session")
const app = express()
const port = process.env.PROT || 3000

app.use(session({
	secret: "super secret string",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 10000,
	},
}))

app.use((req, res, next)=> {
	console.log(`${req.method} for ${req.url}`)
	next()
})

// built-in middleware
app.use(express.static("./public"))

app.get("/views", (req, res) => {
	if (req.session.views) {
		req.session.views++
		res.write(`<p>Views: ${req.session.views}</p>`)
		res.write(`<p>expires: ${req.session.cookie.maxAge / 1000}</p>`)
		res.end()
	}
	else {
		req.session.views = 1
		res.end("Welcome to the session demo, refresh!")
	}
})

// error-handling middleware
app.use((err, req, res, next) => {
	console.log("Error")
	res.status(500).send("something broke!")
})

/*
app.get("/", (req, res) => {
	res.cookie("mycookie", "myvalue", {httpOnly: true, secure: true})
	res.cookie("rememberme", "1", {expires: 7})
	res.send("Hello, world!")
})
*/

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})