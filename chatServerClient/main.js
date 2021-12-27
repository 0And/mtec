const Server = require("./chat/server.js")
const Client = require("./chat/client.js")

let main = async function () {
	let found = await Server.exists()
	let prompt = found ? "Server found. Connect to server? (y/n) " : "No server found. Create a server? (y/n) "
	process.stdout.write(prompt)
	
	process.stdin.setRawMode(true)
	process.stdin.setEncoding("utf8")
	process.stdin.resume()
	process.stdin.on("data", (d) => {
		if (typeof d === "string") {
			process.stdout.clearLine(0)
			process.stdout.cursorTo(0)
			process.stdout.write(prompt)

			let input = d.toString().trim()
			process.stdout.write(input)
			if (d === "\u0003" || d === "\u0004" || d === "\u001b" || input === "n" || input === "N") {
				// ctrl-c or ctrl-d or esc or n or N
				process.stdout.clearLine(0)
				process.stdout.cursorTo(0)
				process.exit()
			}
			else if (input === "y" || input === "Y") {
				// y or Y
				process.stdout.clearLine(0)
				process.stdout.cursorTo(0)
				process.stdin.setRawMode(false)
				process.stdin.removeAllListeners("data")
				if (found) {
					new Client()
				}
				else {
					new Server()
				}
			}
		}
	})
}

main()