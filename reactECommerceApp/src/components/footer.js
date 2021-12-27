import React from 'react'
import { Link } from 'react-router-dom'

class Footer extends React.Component {
	render() {
		return(<footer>
			<div>
				<Link className="alt" to="/"><h2><i className="fab fa-react"></i> React E-commerce Store</h2></Link>
				2020 React E-commerce Store
			</div>
			<div>
				<h3>Site</h3>
				<Link to="/">Home</Link>
				<Link to="/shop">Shop</Link>
				<Link to="/cart">Cart</Link>
			</div>
			<div>
				<h3>Media</h3>
				<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/">
					<i className="fab fa-twitter"></i>
				</a>
				<a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/">
					<i className="fab fa-youtube"></i>
				</a>
			</div>
		</footer>)
	}
}

export default Footer