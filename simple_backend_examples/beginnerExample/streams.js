/*
const fs = require("fs")

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
	let chunk;
	// Use a loop to make sure we read all available data.
	while ((chunk = process.stdin.read()) !== null) {
		process.stdout.write(`data: ${chunk}`);
	}
});

process.stdin.on('end', () => {
	process.stdout.write('end');
});
*/
process.stdin.pipe(process.stdout)