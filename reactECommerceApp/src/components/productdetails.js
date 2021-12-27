import React from 'react'
import CartModal from './cartmodal'
import { connect } from 'react-redux'
import {addProduct, updateProduct, deleteProduct} from '../store/actions'

class ProductDetails extends React.Component {
	state = {
		cartOpen: false,
		product: this.props.product ? this.props.product : {},
	}
	getReviewStars() {
		let stars = []
		if (this.state.product.rating) {
			let fullStars = parseInt(this.state.product.rating)
			let halfStars = Math.round(this.state.product.rating - fullStars)
			for (let i = 0; i < 5; i++) {
				if (fullStars > 0) {
					stars.push(<i key={"star" + i} className="fas fa-star"></i>)
					fullStars -= 1
				}
				else if (halfStars > 0) {
					stars.push(<i key={"star" + i} className="fas fa-star-half-alt"></i>)
					halfStars = 0
				}
				else {
					stars.push(<i key={"star" + i} className="far fa-star"></i>)
				}
			}
		}
		return stars
	}
	componentDidUpdate() {
		if (this.props.product.id !== this.state.product.id) {
			this.setState(currentState => ({
				cartOpen: currentState.cartOpen,
				product: this.props.product ? this.props.product : {},
			}))
		}
	}
	toggleCartModal(visible) {
		if (this.state.cartOpen !== visible) {
			this.setState(currentState => ({
				cartOpen: visible,
				product: currentState.product,
			}))
		}
	}
	addToCart(amount, t) {
		this.toggleCartModal(false)
		this.props.addProduct(this.state.product.id, amount)
	}
	render() {
		return(<section className="productdetails">
			<div>
				<img src={this.state.product.img} alt={this.state.product.title}/>
			</div>
			<div>
				<div className="titlebox">
					<h1>{this.state.product.title}</h1>
					<h4>{this.state.product.id}</h4>
				</div>
				<h3 className="price">${this.state.product.price}</h3>
				<hr/>
				<div className="reviewbox">
					{ this.getReviewStars() }
					<h4>{this.state.product.rating}</h4>
				</div>
				<p>{this.state.product.description}</p>
			</div>
			<div className="buybox">
				<h1>{this.state.product.title}</h1>
				<h3 className="alt2">${this.state.product.price}</h3>
				<button onClick={e => this.toggleCartModal(true, e)}>Add to Cart</button>
			</div>
			<CartModal add={this.addToCart.bind(this)} cancel={this.toggleCartModal.bind(this, false)} open={this.state.cartOpen} product={this.state.product}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)