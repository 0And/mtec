import React from 'react'
import ProductList from '../components/productlist'

class Shop extends React.Component {
	state = {
		search: "",
		categories: [],
		category: "",
	}
	componentDidMount() {
		fetch("https://my-json-server.typicode.com/tdmichaelis/typicode/categories")
			.then((response) => {
				return response.json()
			})
			.then((array) => {
				this.setState(currentState => ({
					search: currentState.search,
					categories: ["all"].concat(array),
					category: "all",
				}))
			})
	}
	changeCategory(id) {
		this.setState(currentState => ({
			search: currentState.search,
			categories: currentState.categories,
			category: currentState.categories[id],
		}))
	}
	searchChange() {
		let str = document.getElementById("searchfilter") ? document.getElementById("searchfilter").value : ''
		if (this.state.search !== str) {
			this.setState(currentState => ({
				search: str,
				categories: currentState.categories,
				category: currentState.category,
			}))
		}
	}
	render() {
		return(<section>
			<div className="categorybar">
				{ this.state.categories.map((element, i) => (
					<button onClick={e => this.changeCategory(i, e)} className={`alt${this.state.category === element ? " selected" : ""}`} key={"category"+i}>
						{element}
					</button>
				)) }
			</div>
			<input id="searchfilter" className="filter" placeholder="Search..." onChange={e => this.searchChange()} />
			<ProductList category={this.state.category} filter={this.state.search}/>
		</section>)
	}
}

export default Shop