const path = require("path")
const express = require("express")

const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))

let connections = []

io.on("connection", (socket) => {
	console.log("socket connected")
	connections.push(socket)
	socket.on("chat message", (msg) => {
		//emit a "chat message" to all clients
		//io.emit("chat message", msg)
		socket.emit("server message", msg)
		socket.broadcast.emit("server message", msg)
	})
	socket.on("disconnect", () => {
		console.log("socket disconnected")
		connections = connections.filter(e => e !== socket)
	})
})

http.listen(port, () => {
	console.log(`Server is up, listening on port ${port}.`)
})