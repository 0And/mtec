import React from 'react'
import { connect } from 'react-redux'
import {addProduct, updateProduct, deleteProduct} from '../store/actions'

import BuyModal from './buymodal'

class CartList extends React.Component {
	state = {
		products: [],
	}
	componentDidMount() {
		fetch("https://my-json-server.typicode.com/tdmichaelis/json-api/products")
			.then((response) => {
				return response.json()
			})
			.then((array) => {
				this.setState({
					products: array,
				})
			})
	}
	render() {
		let products = this.state.products
		return(<section className="cartlist">
			<h1>My Cart</h1>
			{ this.props.cartProducts.cart.map((element, i) =>
				(products[i] && element > 0 ? <BuyModal key={i} amount={element} product={products[i]} /> : '')
			)}
		</section>)
	}
}

const mapDispatchToProps = dispatch => ({
	addProduct: (id, amount) => dispatch(addProduct(id, amount)),
	updateProduct: (id, amount) => dispatch(updateProduct(id, amount)),
	deleteProduct: (id) => dispatch(deleteProduct(id)),
})
const mapStateToProps = state => ({
	cartProducts: state.cartProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(CartList)