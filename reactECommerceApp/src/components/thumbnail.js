import React from 'react'
import { Link } from 'react-router-dom'

class Thumbnail extends React.Component {
	state = {
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
	render() {
		return(<section className="thumbnail">
			<Link className="alt2" to={`/shop/${this.state.product.id}`}>
				<img src={this.state.product.img} alt={this.state.product.title}/>
				<h1>{this.state.product.title}</h1>
				<div className="reviewbox">
					{ this.getReviewStars() }
					<h4>{this.state.product.rating}</h4>
				</div>
			</Link>
		</section>)
	}
}

export default Thumbnail