import React from 'react'
import { Link } from 'react-router-dom'
import ProductList from '../components/productlist'

class Home extends React.Component {
	render() {
		return(<section>
			<div className="hero">
				<h1><i className="fab fa-react"></i> React E-commerce Store</h1>
				<h4>A react e-commerce store. Maybe. Don't take our word for it.</h4>
				<Link to="/shop" className="btn">Go Shopping</Link>
			</div>
			<ProductList heading={"Most Popular"} rating={4.75} />
		</section>)
	}
}

export default Home