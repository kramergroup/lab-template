import { Component } from 'react';

import SplitView from '../src/SplitView';

import config from '../app.config';  
import Welcome from './guidance/welcome.mdx';
import Features from './guidance/features.mdx';
class Lab extends Component {

  constructor(props) {
    super(props);

    this.state = { splitView: true };
  }

  render() {

    return (
      <div className="container">

        <SplitView backend={config.backendURL}>
          <Welcome/>
          <Features/>
        </SplitView>

      </div>
      
    );
  }
}

export default Lab;