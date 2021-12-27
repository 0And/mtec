const net = require("net")
const config = require("./config.json")
const {
	isJson,
} = require("./utils.js")
const fs = require("fs")

class Server {
	constructor(port, address) {
		this.state = undefined
		this.port = port ? port : config.port
		this.address = address ? address : config.address
		this.chat = {
			connections: 0,
			users: {},
			log: [],
		}
		this.adminPassword = "supersecretpw"

		this._init()
	}
	_init() {
		this.state = net.createServer((client) => {
			client.on("data", (chunk) => {
				if (isJson(chunk.toString())) {
					let obj = JSON.parse(chunk.toString().trim())
					let id = typeof obj.id === "string" ? obj.id.trim() : ""
					let fakeSession = typeof obj.fakeSession === "string" ? obj.fakeSession.trim() : ""
					let msg = typeof obj.msg === "string" ? obj.msg.trim().slice(0, config.maxMessage) : ""
					if (this.chat.users[id] && this.chat.users[id].fakeSession === fakeSession) {
						if (msg.startsWith("/")) {
							msg = msg.slice(1, msg.length)
							let params = msg.split(" ")
							switch (params[0]) {
								case "w":
									if (params.length >= 3) {
										let newMsg
										let recipient = params[1]
										let privateMessage = ""
										for (let i = 0; i < params.length - 2; i++) {
											privateMessage = privateMessage + params[i + 2] + " "
										}
										if (id !== recipient && this.chat.users[recipient]) {
											newMsg = {id: id, msg: `[Private message from ${id}]: ${privateMessage}`}
											this.send(recipient, JSON.stringify(newMsg))
											newMsg = {id: id, msg: `[Private message to ${recipient}]: ${privateMessage}`}
											this.send(id, JSON.stringify(newMsg))
										}
										else if (!this.chat.users[recipient]) {
											newMsg = {id: id, msg: `That player does not exist!`}
											this.send(id, JSON.stringify(newMsg))
										}
										else {
											newMsg = {id: id, msg: `You can't send messages to yourself!`}
											this.send(id, JSON.stringify(newMsg))
										}
									}
									else {
										let newMsg
										newMsg = {id: id, msg: `Insufficient parameters in your command!`}
										this.send(id, JSON.stringify(newMsg))
									}
									break
								case "username":
									if (params.length === 2) {
										let newName = params[1].match(/^[a-z0-9]+$/i)
										if (newName) {
											newName = newName.toString().slice(0, config.maxUsername)
											if (newName !== "") {
												this._createUser(client, newName)
											}
											else {
												let newMsg = {id: id, msg: `You cannot change your username to ${params[1]}!`}
												this.send(id, JSON.stringify(newMsg))
											}
										}
										else {
											let newMsg = {id: id, msg: `You cannot change your username to ${params[1]}!`}
											this.send(id, JSON.stringify(newMsg))
										}
										
									}
									else {
										let newMsg = {id: id, msg: `You cannot change your username to ${params[1]}!`}
										this.send(id, JSON.stringify(newMsg))
									}
									break
								case "kick":
									let newMsg = {id: id, msg: ""}
									if (params.length === 3 && this.chat.users[params[1]] && params[2] === this.adminPassword) {
										this.kick(params[1])
									}
									else {
										if (params.length !== 3) {
											newMsg.msg = "Insufficient parameters in your command!"
										}
										else if (!this.chat.users[params[1]]) {
											newMsg.msg = "No users with that username!"
										}
										else if (params[2] !== this.adminPassword) {
											newMsg.msg = "Incorrect password!"
										}
										else {
											newMsg.msg = "There was an error with your command!"
										}
										this.send(id, JSON.stringify(newMsg))
									}
									break
								case "clientlist":
									this.send(id, JSON.stringify({id: id, msg: "Client list: " + Object.keys(this.chat.users).toString()}))
									break
								default:
									this.send(id, JSON.stringify({id: id, msg: `"${params[0]}" is not a command!`}))
									break
							}
						}
						else if (msg !== "") {
							let newMsg = {id: id, msg: id + ": " + msg}
							this.send(this.chat.users, JSON.stringify(newMsg))
						}
					}
					else if (id === "" && msg === "/join") {
						this._createUser(client)
					}
				}
			})
			client.on("end", () => {
				client.end()
				let list = this.chat.users
				Object.keys(list).forEach((key) => {
					if (client === list[key].socket) {
						list[key].socket.destroy()
						delete list[key]
						this.chat.connections--
						let newMsg = {id: key, msg: key + " left the server."}
						this.send(this.chat.users, JSON.stringify(newMsg))
					}
				})
			})
			client.on("error", (e) => {
				console.log(e)
			})
		})
		this.state.listen(this.port)
		console.log(`Server listening on port ${this.port}!`)
	}
	_createUser(socket, name) {
		let oldName = ""
		if (name) {
			Object.keys(this.chat.users).forEach((key) => {
				if (socket === this.chat.users[key].socket) {
					oldName = key
					delete this.chat.users[key]
					this.chat.connections--
				}
			})
		}
		let makeId = function() {
			const LENGTH = 4
			const CHARACTERS = "0123456789"
			let result = ""
			for (let i = 0; i < LENGTH; i++) {
				result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
			}
			return result
		}
		let makeFakeSession = function() {
			const LENGTH = 64
			const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			let result = ""
			for (let i = 0; i < LENGTH; i++) {
				result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
			}
			return result
		}
		let id = name ? name : makeId()
		while (this.chat.users[id] != undefined) {
			id = makeId()
		}
		let welcomeMsg = name ? `${oldName} changed their username to ${id}!` : `${id} joined the server!`
		let newMsg = {id: id, msg: welcomeMsg}
		this.send(this.chat.users, JSON.stringify(newMsg))
		this.chat.users[id] = {
			fakeSession: makeFakeSession(),
			socket: socket
		}
		welcomeMsg = name ? `You changed your username to ${id}!` : `Welcome to the server, user ${id}!`
		newMsg = {id: id, fakeSession: this.chat.users[id].fakeSession, msg: welcomeMsg}
		this.send(id, JSON.stringify(newMsg))
		this.chat.connections++
		return id
	}
	static async exists(port, address) {
		return new Promise((resolve) => {
			let connection = net.createConnection({
				port: port ? port : config.port,
				address: address ? address : config.address
			})
			connection.once("error", (e) => {
				resolve(false)
			})
			connection.once("connect", () => {
				connection.end()
				resolve(true)
			})
		})
		//
	}
	kick(id) {
		let newMsg = { id: id, msg: "You have been kicked." }
		this.send(id, JSON.stringify(newMsg))
		let kickedSocket = this.chat.users[id].socket
		delete this.chat.users[id]
		this.chat.connections--
		kickedSocket.destroy()
		newMsg = { id: id, msg: id + " was kicked from the server." }
		this.send(this.chat.users, JSON.stringify(newMsg))
	}
	send(list, msg) {
		if (typeof msg === "string") {
			if (typeof list === "object") {
				Object.keys(list).forEach((key) => {
					list[key].socket.write(msg)
				})
				this.chat.log.push(msg)
			}
			else if (typeof list === "string" && this.chat.users[list] && this.chat.users[list].socket) {
				this.chat.users[list].socket.write(msg)
				this.chat.log.push(msg)
			}
			let newData = this.chat.log.map((e) => {
				return e + "\n"
			})
			let stream = fs.createWriteStream("chat.log", 'utf8')
			stream.write(newData.toString())
		}
	}
}

module.exports = Server