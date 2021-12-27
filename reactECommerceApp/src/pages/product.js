import React from 'react'

import { Link, Redirect } from 'react-router-dom'
import ProductDetails from '../components/productdetails'
import ProductList from '../components/productlist'

class Product extends React.Component {
	state = {
		loaded: false,
		product: {},
	}
	fetchProduct() {
		fetch("https://my-json-server.typicode.com/tdmichaelis/json-api/products")
			.then((response) => {
				return response.json()
			})
			.then((array) => {
				let pageID = parseInt(this.props.match.params.id)
				let fetchedProduct = array.find(obj => obj.id === pageID)
				this.setState({
					loaded: true,
					product: (fetchedProduct ? fetchedProduct : {}),
				})
			})
	}
	componentDidMount() {
		this.fetchProduct()
	}
	componentDidUpdate() {
		if (parseInt(this.props.match.params.id) !== this.state.product.id) {
			this.fetchProduct()
		}
	}
	render() {
		return(<section className="productpage">
			<Link to="/shop" className="alt2"><i className="fas fa-long-arrow-alt-left"></i> Back to shop</Link>
			{ this.state.loaded && this.state.product.id ? <ProductDetails product={this.state.product} />
			: this.state.loaded ? <Redirect to="/shop"/>
			: ''
			}
			<ProductList heading={"Recommended"} category={this.state.product.category} noshow={this.state.product.id} />
		</section>)
	}
}

export default Product