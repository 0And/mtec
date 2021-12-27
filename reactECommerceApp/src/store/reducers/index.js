import { combineReducers } from 'redux'

let localState = localStorage.state ? JSON.parse(localStorage.state) : {cart: []}

const cartProducts = function(state = { cart: localState.cart ? localState.cart : []}, action) {
	let newState = {...state}
	let index = action.id - 1
	let num = parseInt(action.amount)
	switch(action.type) {
		case "ADD_PRODUCT":
			newState.cart[index] = newState.cart[index] ? newState.cart[index] + num : num
			localStorage.state = JSON.stringify(newState)
			return (newState)
		case "UPDATE_PRODUCT":
			newState.cart[index] = action.amount ? num : 0
			localStorage.state = JSON.stringify(newState)
			return (newState)
		case "DELETE_PRODUCT":
			newState.cart[index] = 0
			localStorage.state = JSON.stringify(newState)
			return (newState)
		default:
			localStorage.state = JSON.stringify(state)
			return state
	}
}

export default combineReducers({
	cartProducts
})