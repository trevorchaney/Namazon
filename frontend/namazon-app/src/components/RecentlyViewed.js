import React from 'react';
import ScrollArea from 'react-scrollbar';

class RecentlyViewed extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <ScrollArea
        speed={0.8}
        className="RecentlyViewedComponent"
        contentClassName="content"
        horizontal={false}
        verticalScrollbarStyle={{backgroundColor: "black"}}
       >
        <div>
          <h1>Recently Viewed Items</h1>
          <p>{JSON.stringify(this.props.dataBlob.token)}</p>
          <ul>
          </ul>
        </div>
      </ScrollArea>
    );
  }
}

export default RecentlyViewed
