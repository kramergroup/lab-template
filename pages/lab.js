import { Component } from 'react';

import SplitView from '../src/components/SplitView';

import config from '../app.config';  
import Welcome from './guidance/welcome.mdx';
import Features from './guidance/features.mdx';
import Test from './guidance/test.mdx';
class Lab extends Component {

  constructor(props) {
    super(props);

    this.state = { splitView: true };
  }

  render() {

    return (
      <div className="container">

        <SplitView backendURL={config.backendURL} backendType="wetty">
          <Test/>
          <Welcome/>
          <Features/>
        </SplitView>

      </div>
      
    );
  }
}

export default Lab;