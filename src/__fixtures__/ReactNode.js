// @flow
import * as React from 'react';

export type MyElem = React.Node;

type Props = {
  age: number;
  icon: React.Node;
};

class MyNumber extends React.Component {
  render() {
    return (
      <div>
        {this.props.age} {this.props.icon}
      </div>
    );
  }
}

export default MyNumber;
