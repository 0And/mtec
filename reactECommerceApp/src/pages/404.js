import React from 'react'
import { Link } from 'react-router-dom'
import ProductList from '../components/productlist'

class NotFound extends React.Component {
	render() {
		return(<section>
			<div className="hero">
				<h1>welkum 2 da 404 error paij</h1>
				<h4>buy our produkz</h4>
				<Link to="/shop" className="btn">go buy</Link>
			</div>
			<ProductList heading={"buy 2day"} />
		</section>)
	}
}

export default NotFound