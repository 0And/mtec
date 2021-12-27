const express = require("express")
const fs = require("fs")
const bodyParser = require("body-parser")

// order matters here in express when using the .get(), .post(), etc methods.
const app = express()
const port = process.env.PROT || 3000

// for parsing application/json
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
// extended: true (Allow nested Object = {person: { name: cw }})
// false: for handling simple key:value
app.use(bodyParser.urlencoded({ extended: true }))
// FOR EXAMPLE:
//<input type="text" name="recipe" id="recipe">
//let recipe = req.body.recipe



// If this gets uncommented, then the home page will be the the string instead of the index.html file in public.
/*
app.get("/", (req, res) => {
	res.send("home page | <a href='/file'>file page</a> | <a href='/html'>html page</a>")
})
*/
//this will take over the get app.get '/' route.
app.use(express.static("public"))

//when a get request is coming from the root
app.get("/", (req, res) => {
	res.send("home page | <a href='/file'>file page</a> | <a href='/html'>html page</a>")
})

app.get("/file", (req, res) => {
	fs.createReadStream("test.txt").pipe(res)
})

app.get("/html", (req, res) => {
	//fs.createReadStream("public/index.html").pipe(res)
	res.redirect("/")
})

app.post("/user", (req, res) => {
	let firstName = req.body.first
	let lastName = req.body.last
	let email = req.body.email
	console.log(`we got a post request: ${firstName}`)
	//console.log(req)
	// req and res are both http requests
	res.redirect("/html")
	fs.appendFile("info.csv", `${new Date().toLocaleDateString()},${firstName},${lastName},${email}\n`, (err) => {
		if (err) throw err
		console.log("successful info.csv write")
	})
})

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})