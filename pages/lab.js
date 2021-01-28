import Head from 'next/head';
import { Component } from 'react';

import SplitView from '../src/SplitView';

import config from '../app.config';  

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
          
        <SplitView steps={config.steps} backend={config.backendURL}/>
      </div>
      
    );
  }
}

export default Lab;