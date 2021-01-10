import React from 'react';
import ScrollArea from 'react-scrollbar';

class StoreItem extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <ScrollArea
        speed={0.8}
        className="StoreItemComponent"
        contentClassName="content"
        horizontal={false}
      >
        <div>
          <h1>Available Items</h1>
          <ul>
            {this.props.dataBlob.itemsInStore}
            <li>A list of the items available in the store.</li>
            <li>A button to add the item to the users cart.</li>
            <li>A button to simulate the user "viewing" the item. This puts the item into a stack of the user's 10 most recent viewed items.</li>
            <li>A button to change the item list from assending and decending alphabetical order.</li>
            <li>A search bar to find specific items.</li>
          </ul>
        </div>
      </ScrollArea>
    );
  }
}

export default StoreItem
