export const addProduct = (id, amount) => ({
	type: "ADD_PRODUCT",
	id: id,
	amount: amount,
})

export const updateProduct = (id, amount) => ({
	type: "UPDATE_PRODUCT",
	id: id,
	amount: amount,
})

export const deleteProduct = (id) => ({
	type: "DELETE_PRODUCT",
	id: id,
	amount: 0,
})