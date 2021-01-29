import Head from 'next/head';
import React, { useState } from 'react';

import { Component } from "react";
import { Button } from "@material-ui/core";

import Progress from "./Progress";

import { MDXProvider } from '@mdx-js/react'
import CodeBlock from '../src/CodeBlock';

const components = {
  pre: props => <div {...props} />,
  code: props => <CodeBlock {...props} />
}

/*
  GuidePane is the main component displaying the guidance for the lab.
  
  The pane is shown to the side of the working area and will render the
  individual tutorial steps.
  Properties:
    steps - an array containing a component for each step in the tutorial
*/
class GuidePane extends Component {

  constructor(props) {

    super(props);

    this.CurrentStep = this.CurrentStep.bind(this);
    this.BackButton = this.BackButton.bind(this);
    this.NextButton = this.NextButton.bind(this);
    this.NavigationBar = this.NavigationBar.bind(this);
    this.increaseIndex = this.increaseIndex.bind(this);
    this.decreaseIndex = this.decreaseIndex.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      currentStep: 0
    };

    
  }

  componentDidUpdate(prevProps, prevState) {
    
    if ( prevState.currentStep != this.state.currentStep) {
      localStorage.setItem('guide-current-step', this.state.currentStep);
    }

  }

  componentDidMount() {

    var savedStep = Number(window.localStorage.getItem('guide-current-step')) || 0;
    if (savedStep >= this.props.steps.length ) {
      savedStep = 0;
    }

    this.setState({currentStep: savedStep});

  }

  CurrentStep() {
    
    if (this.props.steps.length < this.state.currentStep) {
      return (<div className="error">Step not defined for step index: {this.state.currentStep}</div>)
    } else {
      const Step = this.props.steps[this.state.currentStep];
      return (<Step />);
    }

  }

  BackButton() {

    if (this.state.currentStep > 0 && this.props.steps.length > 0) {
      return (
        <Button onClick={this.decreaseIndex}>
          Back
        </Button>
      );
    } else {
      return (<div></div>);
    }

  }

  NextButton() {

    if (this.state.currentStep < this.props.steps.length-1 ) {
      return(
        <Button onClick={this.increaseIndex}>
          Next
        </Button>
      );
    } else {
      return (<div></div>);
    }

  }

  increaseIndex() {

    this.setState(
      {currentStep: this.state.currentStep+1}
    );

  }

  decreaseIndex() {

    this.setState(
      {currentStep: this.state.currentStep-1}
    );

  }

  /* guideContainer creates a div that scrolls to the top if the 
     current step changes
   */
  guideContainer(props) {

    const guideDivRef = React.useRef(null);

    React.useEffect(() => {
      guideDivRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }, [props.current]);

    return (
      <div className="content" ref={guideDivRef}>
        {props.children}
     
        <style jsx>{`
        .content {
          flex-grow: 10;
          flex-shrink: 10;
          overflow: scroll;
          padding-left: 1em;
          padding-right: 1em;
        }
        `}</style>

      </div>
    
    );

  }

  NavigationBar({current,numSteps}) {

    if (numSteps > 1) {
      return (
        <div className="navigation">
          <this.BackButton/>
            <Progress total={numSteps} current={current}/>
          <this.NextButton/>

          <style jsx>{`
          .navigation {
            flex-grow: 0;
            flex-shrink: 0;
            display: grid;
            grid-template-columns: 100px auto 100px;
            margin-top: 1em;
            background: white;
            border-top: solid 1px #DDD;
          }
        `}</style>
        </div>
      );
    } else {
      return(
        <div style={{display: "hidden"}}/>
      );
    }


  }

  render() {

    return (

      <div className="guide">
            
        <Head>
          <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.1/css/all.css" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Thambi+2&display=swap" />
        </Head>

        <MDXProvider components={components}>
          <this.guideContainer current={this.state.currentStep}>
            <this.CurrentStep/>
          </this.guideContainer>
        </MDXProvider>
        
        <this.NavigationBar current={this.state.currentStep} numSteps={this.props.steps.length}/>

        <style jsx>{`
          .guide {
            display:flex;
            flex-direction: column;
            margin: 0px;
            height: 100vh;
            font-family: 'Baloo Thambi 2', cursive;
          }
        `}</style>

      </div>
    
    )
  }

}

export default GuidePane;