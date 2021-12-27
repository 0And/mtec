import React from 'react'
import Thumbnail from './thumbnail'

class ProductList extends React.Component {
	state = {
		category: "",
		products: [],
	}
	componentDidMount() {
		fetch("https://my-json-server.typicode.com/tdmichaelis/json-api/products")
			.then((response) => {
				return response.json()
			})
			.then((array) => {
				this.setState({
					category: this.props.category ? this.props.category : "all",
					products: array,
				})
			})
	}
	componentDidUpdate(oldProps) {
		if (this.props.category !== oldProps.category && this.props.category !== this.state.category) {
			this.setState(currentState => ({
				category: this.props.category ? this.props.category : "all",
				products: currentState.products,
			}))
		}
	}
	render() {
		let filter = this.state.products.filter(obj =>
			obj && obj.title
			&& (this.state.category === "all" || this.state.category === obj.category)
			&& obj.id !== this.props.noshow
			&& (this.props.filter && this.props.filter !== "" && !RegExp(this.props.filter, "i").test(obj.title) ? false : true)
			&& (this.props.rating && parseFloat(obj.rating) < parseFloat(this.props.rating) ? false : true))
		return(<section className="productlist">
			<h1>{ filter.length > 0 ? this.props.heading : '' }</h1>
			{ filter.map(obj => <Thumbnail key={"thumbnail"+obj.id} product={obj} />) }
		</section>)
	}
}


export default ProductList