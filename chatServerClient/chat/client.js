const net = require("net")
const config = require("./config.json")
const {
	isJson,
} = require("./utils.js")

class Client {
	constructor(port, address) {
		this.socket = new net.Socket()
		this.port = port ? port : config.port
		this.address = address ? address : config.address
		this.id = undefined
		this.fakeSession = undefined
		this.line = ""
		this.pos = 0
		this._init()
	}
	_init() {
		this.socket.connect({ port: this.port }, () => {
			this.socket.write(JSON.stringify({
				id: "",
				msg: "/join"
			}))
			process.stdin.setRawMode(true)
			process.stdin.setEncoding("utf8")
			process.stdin.resume()
			process.stdin.on("data", (d) => {
				if (typeof d === "string") {
					let input = d.toString().trim()
					if (d === "\u0003" || d === "\u0004" || d === "\u001b") {
						//ctrl-c or ctrl-d or esc
						process.stdout.clearLine(0)
						process.stdout.cursorTo(0)
						process.exit()
					}
					else if (d === "\u0020") {
						//space
						this.line = this.line.slice(0, this.pos) + " " + this.line.slice(this.pos, this.line.length)
						this.pos = this.pos + 1
					}
					else if (d === "\u0008" || d === "\u007f") {
						//backspace or delete
						this.line = this.line.slice(0, Math.max(0, this.pos - 1)) + this.line.slice(this.pos, this.line.length)
						this.pos = Math.max(0, this.pos - 1)
					}
					else if (d === "\u000d") {
						//enter
						this.sendMessage(this.line)
						this.line = ""
						this.pos = 0
					}
					else if (d === "\u001b\u005b\u0044") {
						this.pos = Math.max(0, this.pos - 1)
					}
					else if (d === "\u001b\u005b\u0043") {
						this.pos = Math.min(this.pos + 1, this.line.length)
					}
					else if (input.charCodeAt(0) >= 33 && input.charCodeAt(0) <= 126 && input.length === 1) {
						this.line = this.line.slice(0, this.pos) + input + this.line.slice(this.pos, this.line.length)
						this.pos = this.pos + 1
					}
					if (this.line.length >= process.stdout.columns) {
						this.line = this.line.slice(0, process.stdout.columns - 1)
						this.pos = this.line.length
					}
					process.stdout.clearLine(0)
					process.stdout.cursorTo(0)
					process.stdout.write(this.line)
					process.stdout.cursorTo(this.pos)
				}
			})
		})
		this.socket.on("data", (chunk) => {
			if (isJson(chunk.toString())) {
				let obj = JSON.parse(chunk.toString())
				let id = obj.id
				let fakeSession = obj.fakeSession
				let msg = obj.msg
				if (fakeSession && id) {
					this.fakeSession = fakeSession
					this.id = id
					if (msg) {
						this.receiveMessage(msg)
					}
				}
				else if (id && msg) {
					this.receiveMessage(msg)
				}
			}
		})
		this.socket.on("end", () => {
			this.receiveMessage("Server died.")
			process.stdout.clearLine(0)
			process.stdout.cursorTo(0)
			process.exit()
		})
		this.socket.on("error", (e) => {
			// catch error
		})
	}
	receiveMessage(msg) {
		process.stdout.clearLine(0)
		process.stdout.cursorTo(0)
		process.stdout.write(msg + "\n" + this.line)
		process.stdout.cursorTo(this.pos)
	}
	sendMessage(msg) {
		if (this.id && this.fakeSession && msg && msg !== "") {
			this.socket.write(JSON.stringify({
				id: this.id,
				fakeSession: this.fakeSession,
				msg: msg,
			}))
		}
	}
}

module.exports = Client