const bcrypt = require('bcryptjs')

class User {
	constructor(first, last, email, password) {
		let salt = bcrypt.genSaltSync(12)
		let hashedPassword = bcrypt.hashSync(password, salt)

		this.first = first
		this.last = last
		this.email = email
		this.password = hashedPassword
	}
	validatePassword(password) {
		let isMatched = bcrypt.compareSync(password, this.password)
		if (isMatched) {
			return true
		}
		else {
			return false
		}
		//compare password and return true or false
		//usage example:
		// let sam = new User('sam', 'spade', 'sspade@spy.org', 'password' )
		// let isPasswordGood = same.validatePassord('ilovesam')  -- here the return vale is false
		// let isPasswordGood = same.validatePassord('password')  -- here the return vale is true
	}
}
class Users {  // user collection
	constructor() {
		//usage example:
		// let userCollection = new Users()
		this.userArray = []
	}
	createUser(first, last, email, pass) {
		return new User(first, last, email, pass)
	}
	addOne(user) {
		this.userArray.push(user)
		//add new user to the array
		//usage example:
		//let oneNewUser = new User(.........)
		//let userCollection = new Users()
		// userCollection.addOne(oneNewUser)
	}
	findOne(email, callback) {
		let aUser = false
		aUser = this.userArray.find((element) => {
			return element.email === email
		})
		// do we have a match user with the same given email
		// if so returen that user
		// example
		//   users.findOne(email, (err, user) =>{
		// do whatever needed to be done
		//})....
		callback(null, aUser)
	}
	// listAll(){
	//     // return all users
	// }
}

let a = new User('a', 'a', 'a@a.a', 'a')
let users = new Users()

users.addOne(a)
module.exports = users