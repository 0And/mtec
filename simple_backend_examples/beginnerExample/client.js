// Client Code

const net = require('net')
const client = net.createConnection({ port: 3000 }, () => {
	// Once Connected
	console.log('connected to server!')
	//client.write('1 ... Anyone there!\r\n')
	//client.write('2 ... What did you say!\r\n')
	process.stdin.on('readable', () => {
		let chunk
		// Use a loop to make sure we read all available data.
		while ((chunk = process.stdin.read()) !== null) {
			client.write(chunk)
		}
	})
})
client.on('data', (data) => {
	console.log(data.toString())
	//client.end()
})
client.on('end', () => {
	console.log('End of Message')
})