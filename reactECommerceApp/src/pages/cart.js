import React from 'react'
import CartList from '../components/cartlist'

class Cart extends React.Component {
	render() {
		return(<section className="cart">
			<CartList />
		</section>)
	}
}

export default Cart