/* @flow */
import React from 'react';

type Props = {
  ok: string;
};

class BlockFlow extends React.Component<Props> {
  render() {
    return <div>{this.props.ok}</div>;
  }
}

export default BlockFlow;
