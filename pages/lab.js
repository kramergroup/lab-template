import Head from 'next/head';
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

        <Head>
          <title>{config.title}</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Thambi+2&display=swap" />
        </Head>
          
        <SplitView backend={config.backendURL}>
          <Welcome/>
          <Features/>
        </SplitView>

      </div>
      
    );
  }
}

export default Lab;