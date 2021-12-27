const PGClient = require("pg").Client
const url = process.env.DATABASE_URL || "postgres://localhost:5432/postgres"

const defaultUsers = require("./default_users.json")

let main = function() {
	let init = async function () {
		return new Promise(async (resolve, reject) => {
			const client = new PGClient(url)
			client.connect()
			try {
				let res = await client.query("SELECT obj FROM list")
				if (res && res.rows.length <= 0) {
					res = await client.query("INSERT INTO list(id, obj) VALUES(1, $1)", [JSON.stringify(defaultUsers)])
				}
				resolve(res)
			}
			catch(e) {
				reject(e)
			}
			await client.end()
		})
	}
	let getUsers = async function (term) {
		return new Promise(async (resolve, reject) => {
			const client = new PGClient(url)
			client.connect()
			try {
				let arr = JSON.parse((await client.query("SELECT id, obj FROM list WHERE id=1")).rows[0].obj)
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
			await client.end()
		})
	}
	let createUser = async function (obj) {
		return new Promise(async (resolve, reject) => {
			const client = new PGClient(url)
			client.connect()
			try {
				let arr = JSON.parse((await client.query("SELECT id, obj FROM list WHERE id=1")).rows[0].obj)
				arr[obj.id] = obj
				await client.query("UPDATE list SET obj=$1 WHERE id=1", [JSON.stringify(arr)])
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
			await client.end()
		})
	}
	let editUser = async function (oldID, obj) {
		return new Promise(async (resolve, reject) => {
			const client = new PGClient(url)
			client.connect()
			try {
				let arr = JSON.parse((await client.query("SELECT id, obj FROM list WHERE id=1")).rows[0].obj)
				delete arr[oldID]
				arr[obj.id] = obj
				await client.query("UPDATE list SET obj=$1 WHERE id=1", [JSON.stringify(arr)])
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
			await client.end()
		})
	}
	let deleteUser = async function(id) {
		return new Promise(async (resolve, reject) => {
			const client = new PGClient(url)
			client.connect()
			try {
				let arr = JSON.parse((await client.query("SELECT id, obj FROM list WHERE id=1")).rows[0].obj)
				delete arr[id]
				await client.query("UPDATE list SET obj=$1 WHERE id=1", [JSON.stringify(arr)])
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
			await client.end()
		})
	}

	return { init, getUsers, deleteUser, createUser, editUser }
}

module.exports = main()