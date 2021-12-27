import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Home from './pages/home'
import Shop from './pages/shop'
import Cart from './pages/cart'
import Product from './pages/product'
import NotFound from './pages/404'

import Header from './components/header'
import Footer from './components/footer'

import reducers from './store/reducers'
const store = createStore(reducers)

class App extends React.Component {
	render() {
		return(<Provider store={store}>
			<Router>
				<Header/>
				<Switch>
					<Route exact path="/"><Home/></Route>
					<Route exact path="/shop"><Shop/></Route>
					<Route path="/cart"><Cart/></Route>
					<Route path="/shop/:id" component={Product}/>
					<Route><NotFound/></Route>
				</Switch>
				<Footer/>
			</Router>
		</Provider>)
	}
}

export default App