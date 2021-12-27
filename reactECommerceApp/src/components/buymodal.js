import React from 'react'
import { connect } from 'react-redux'
import {addProduct, updateProduct, deleteProduct} from '../store/actions'

class BuyModal extends React.Component {
	state = {
		amount: 0,
		product: {},
	}
	componentDidMount() {
		this.setState({
			amount: this.props.amount ? this.props.amount : 0,
			product: this.props.product ? this.props.product : {},
		})
	}
	handleChange(event) {
		event.persist()
		if (event.target.value < 0) {
			event.target.value = 0
		}
		else if (event.target.value > 1000) {
			event.target.value = 1000
		}
		event.target.value = Number(event.target.value)
		this.setState(currentState => ({
			amount: event.target.value,
			product: currentState.product,
		}))
		this.props.updateProduct(this.state.product.id, event.target.value)
	}
	render() {
		return(<section className="buymodal">
			<img src={this.state.product.img} alt={this.state.product.title}/>
			<h1>{this.state.product.title}</h1>
			<h3 className="alt2">${this.state.product.price}</h3>
			<div className="pricebox">
				<h3 className="alt2">${Math.ceil(this.state.product.price * this.state.amount * 100) / 100}</h3>
				<input ref="amount" type="number" value={this.state.amount} onChange={e => this.handleChange(e)}/>
			</div>
			<div>
				<button onClick={ () => this.props.deleteProduct(this.state.product.id) }>Buy</button>
				<button className="bare" onClick={ () => this.props.deleteProduct(this.state.product.id) }>Cancel</button>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyModal)