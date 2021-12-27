// Server Code

const net = require('net')
const server = net.createServer((socket) => {
	console.log('Welcome to Echo Server\r\n')
	let array = []
	socket.on('data', (chunk) => {
		let str = chunk.toString().replace(/^[a-z0-9]*$/i, "")
		str ? array.push(str.substr(0, 5)) : ''
		socket.write('Server responds: ' + array.toString())
	})
	socket.on('end', socket.end)
})
server.listen(3000, () => {
	console.log('server is up')
})