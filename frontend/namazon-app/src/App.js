/*
 * NOTE:[]  When you make the request to get the items from the
 *                    /user/<userid>/cart
 *    route. The carts items are at res.cartItems.storeItem. You need to
 *    iterate through the cartItems and do what you are doing with the for
 *    loop to render the items and remove the UserCartItems import.
 */

import React from 'react';
import Login from './components/Login';
import StoreItem from './components/StoreItem';
import Cart from './components/Cart';
import RecentlyViewed from './components/RecentlyViewed';
import './App.css';
import UserCartItems from "./components/sampleCarts";
import AvailableStoreItems from "./components/sampleStore";

class App extends React.Component {
  constructor(props) {
    super(props);

    let ItemsFoundInCart = [];

    for(let i = 0; i < UserCartItems[0].cartItems.length; ++i) {
      ItemsFoundInCart.push(
        <li key={i}>
          {JSON.stringify(UserCartItems[0].cartItems[i])}
          <button type="button" onClick={() => this.handleCartClick(i)}>
            remove
          </button>
        </li>
      )
    }

    let ItemsFoundInStore = [];

    for(let i = 0; i < AvailableStoreItems.length; ++i) {
      ItemsFoundInStore.push(
        <li key={i}>
          {JSON.stringify(AvailableStoreItems[i])}
          <button type="button" name="add" key={i} onClick={this.handleStoreClick}>
            Add to Cart
          </button>
          <button type="button" name="view" key={i} onClick={this.handleStoreClick}>
            "View"
          </button>
        </li>
      )
    }

    this.state = {
      baseURL: "http://localhost:8080",
      isLoggedIn: false,
      firstName: "",
      lastName: "",
      email: "",
      login: "",
      password: "",
      token: "",
      userID: "",
      cartID: "",
      itemsInUsersCart: ItemsFoundInCart,
      itemsInStore: ItemsFoundInStore,
      recentItems: []
    }

    this.updateGlobalState = this.updateGlobalState.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
    this.handleStoreClick = this.handleStoreClick.bind(this);
  };

  updateGlobalState = (dataBlob) => {
    console.log("The data in the data bolb is ", dataBlob);
    this.setState({
      isLoggedIn: dataBlob.isLoggedIn,
      firstName: dataBlob.firstName,
      lastName: dataBlob.lastName,
      email: dataBlob.email,
      login: dataBlob.login,
      password: dataBlob.password,
      token: dataBlob.token,
      userID: dataBlob.userID,
      cartID: dataBlob.cartID
    });
    console.log("The state is now ", this.state);
  }

  handleCartClick = (arg) => {
    const items = this.state.itemsInUsersCart;
    var index;

    for(let i = 0; i < this.state.itemsInUsersCart.length; ++i) {
      if(this.state.itemsInUsersCart[i].key === arg.toString()) {
        index = i;
        break;
      }
    }

    items.splice(index, 1);
    this.setState({
      itemsInUsersCart: items
    });
  }

  handleStoreClick = (event) => {
    if(event.target.name === "view") {
      let addView = this.state.recentItems;
      addView.push(this.state.itemsInStore[event.target.key]);
      this.setState({recentItems: addView})
    } else if(event.target.name === "add") {
      let items = this.state.itemsInUsersCart;
      items.push(this.state.itemsInStore[event.target.key]);
      this.setState({itemsInUsersCart: items});
    }
    event.preventDefaults();
  }

  render() {
    return (
      <div className="App">
        <Login
          dataBlob={this.state}
          updateStateObject={this.updateGlobalState}
        />
        <RecentlyViewed
          dataBlob={this.state}
          updateStateObject={this.updateGlobalState}
        />
        <Cart
          dataBlob={this.state}
          updateStateObject={this.updateGlobalState}
        />
        <StoreItem
          dataBlob={this.state}
          updateStateObject={this.updateGlobalState}
        />
      </div>
    );
  }
}

export default App;
