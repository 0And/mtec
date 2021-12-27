const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const port = process.env.PORT || 3000
const database = require("./db/database")

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
	res.redirect("/users")
})
app.get("/users", async (req, res) => {
	let list = []
	try {
		list = await database.getUsers()
	}
	catch(e) {
		list = []
	}
	res.render("users", {list: list})
})
app.post("/users", async (req, res) => {
	let list = []
	try {
		list = await database.getUsers()
		let arr = []
		Object.keys(list).forEach((key) => {
			arr.push(list[key])
		})
		list = arr
		if (req.body.sort === "ascend") {
			list = list.sort((a, b) => a.name.localeCompare(b.name))
		}
		else if (req.body.sort === "descend") {
			list = list.sort((a, b) => -a.name.localeCompare(b.name))
		}
		list = list.filter(obj => RegExp(req.body.search, "i").test(obj.name))
	}
	catch(e) {
		console.log(e)
	}
	res.render("users", {list: list})
})
app.get("/create_user", async (req, res) => {
	res.render("create_user")
})
app.post("/create_user", async (req, res) => {
	let id = String(req.body.id).replace(/[^A-Z0-9-_$]/ig, '')
	let name = req.body.name
	let email = req.body.email
	let age = req.body.age
	let obj = {}
	try {
		let list = await database.getUsers()
		if (id && name && email && age && !list[id] && id !== "") {
			obj = {
				id: id,
				name: name,
				email: email,
				age: age
			}
			await database.createUser(obj)
		}
	}
	catch(e) {
		obj = {}
	}
	res.redirect("/users")
})
app.get("/edit_user/:id", async (req, res) => {
	let obj = {}
	try {
		list = await database.getUsers()
		obj = list[req.params.id]
	}
	catch(e) {
		obj = {}
	}
	res.render("edit_user", {id: obj["id"], name: obj["name"], email: obj["email"], age: obj["age"]})
})
app.post("/edit_user/:id", async (req, res) => {
	let oldID = req.params.id
	let id = String(req.body.id).replace(/[^A-Z0-9-_$]/ig, '')
	let name = req.body.name
	let email = req.body.email
	let age = req.body.age
	let obj = {}
	try {
		if (id && name && email && age && id !== "") {
			obj = {
				id: id,
				name: name,
				email: email,
				age: age
			}
			await database.editUser(oldID, obj)
		}
	}
	catch(e) {
		obj = {}
	}
	res.redirect("/users")
})
app.post("/delete_user/:id", async (req,res) => {
	let id = req.params.id
	try {
		await database.deleteUser(id)
	}
	catch(e) {}
	res.redirect("/users")
})

app.use(async (req, res) => {
	res.redirect("/")
})

app.listen(port, async () => {
	try {
		await database.init()
		console.log(`Listening on port ${port}!`)
	}
	catch(e) {
		console.log(e)
	}
})