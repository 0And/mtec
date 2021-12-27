// Type "node hello.js 2 2 2" to test this
let args = process.argv.slice(2)
let total = 0
for (let i = 0; i < args.length; i++) {
	let num = Number(args[i])
	total += (Number.isNaN(num) ? 0 : num)
}
console.log(total)