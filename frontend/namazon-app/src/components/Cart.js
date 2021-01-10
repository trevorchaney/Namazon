import React from 'react';
import ScrollArea from 'react-scrollbar';


class Cart extends React.Component {
  render() {
    return (
      <ScrollArea speed={0.8} className="CartComponent" contentClassName="content" horizontal={true}>
        <div>
          <h1>Shopping Cart</h1>
          {this.props.dataBlob.itemsInUsersCart}
        </div>
      </ScrollArea>
    );
  }
}

export default Cart
