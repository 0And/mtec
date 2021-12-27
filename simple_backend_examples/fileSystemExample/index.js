const fs = require("fs")

let fileToRead = process.argv[2]
let fileToWrite = process.argv[3]

// node index bacon.txt newBacon.txt

fs.readFile(fileToRead, 'utf8', function(err, data) {
	if (err) throw err
	let regex = /\bbacon\b/gi
	let newWord = "tasty"

	let newData = data.replace(regex, newWord)
	let stream = fs.createWriteStream(fileToWrite, 'utf8')
	stream.write(newData)

	let arr = data.match(regex)
	console.log(arr ? arr.length : 0)
})