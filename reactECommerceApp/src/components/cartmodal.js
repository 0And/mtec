import React from 'react'

class CartModal extends React.Component {
	state = {
		cartOpen: false,
		amount: 0,
		product: {},
	}
	componentDidMount() {
		this.setState(currentState => ({
			cartOpen: this.props.open,
			amount: currentState.amount,
			product: this.props.product ? this.props.product : {},
		}))
	}
	componentDidUpdate() {
		if (this.props.open !== this.state.cartOpen) {
			let newAmount = 0
			if (!this.props.open) {
				newAmount = this.state.amount
			}
			this.setState(currentState => ({
				cartOpen: this.props.open,
				amount: newAmount,
				product: currentState.product,
			}))
		}
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
			cartOpen: currentState.cartOpen,
			amount: event.target.value,
			product: currentState.product,
		}))
	}
	render() {
		if (this.state.cartOpen) {
			return(<section className="cartmodal">
				<div>
					<h1>{this.state.product.title}</h1>
					<h3 className="alt2">${this.state.product.price}</h3>
					<div className="pricebox">
						<h3 className="alt2">${Math.ceil(this.state.product.price * this.state.amount * 100) / 100}</h3>
						<input ref="amount" type="number" value={this.state.amount} onChange={e => this.handleChange(e)}/>
					</div>
					<div>
						<button onClick={ (e) => this.props.add(this.state.amount, e) }>Add to Cart</button>
						<button className="bare" onClick={this.props.cancel}>Cancel</button>
					</div>
				</div>
			</section>)
		}
		else {
			return(<section>
			</section>)
		}
	}
}



export default CartModal