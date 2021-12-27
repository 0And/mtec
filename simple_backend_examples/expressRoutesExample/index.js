const express = require("express")
const app = express()

let port = process.env.PORT || 3000

let count = 0
app.get("/", (req, res) => {
	count++
	console.log("received a get request")
	res.send(`${count} done`)
})
app.get(/.*apple$/, (req, res) => {
	console.log("received a get request for apple")
	res.send(`${req.path}`)
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
})