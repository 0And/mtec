import React from 'react'
import { connect } from 'react-redux'
import {addProduct, updateProduct, deleteProduct} from '../store/actions'
import { Link } from 'react-router-dom'

class Header extends React.Component {
	render() {
		let result = this.props.cartProducts.cart.filter(element => element > 0).length > 0
		return(<header>
			<div></div>
			<div>
				<Link className="alt" to="/"><h2><i className="fab fa-react"></i> React E-commerce Store</h2></Link>
			</div>
			<div>
				<Link to="/shop"><i className="fas fa-shopping-bag"></i></Link>
				<Link to="/cart"><i className={`fas fa-shopping-cart${result ? " filled" : ''}`}></i></Link>
			</div>
		</header>)
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)