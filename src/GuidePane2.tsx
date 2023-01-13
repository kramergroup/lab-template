
import { useState, useEffect, useRef,FC, ReactNode } from 'react'
import Head from 'next/head';

import { Button } from "@mui/material";

import Progress from './Progress'
import { MDXProvider } from '@mdx-js/react';

import dynamic from 'next/dynamic'

import CodeBlock from './CodeBlock'

interface GuidePaneProps {
  children?: ReactNode[]
}

interface NavigationBarProps {
  current: Number,
  total: Number
}

interface GuideContainerProps {
  children?: ReactNode
}

const components = {
  //pre: props => <pre {...props} />,
  code: props => <CodeBlock {...props} />
}


function GuidePane({children} : GuidePaneProps) {

  const [currentStep, setCurrentStep] = useState(0)
  
  /* guideContainer creates a div that scrolls to the top if the 
     current step changes
   */
  const GuideContainer : FC<GuideContainerProps> = ({children}) => {

    return (
      <div className="content">
        {children}
      
        <style jsx>{`
        .content {
          flex-grow: 10;
          flex-shrink: 10;
          overflow: scroll;
          overflow-x: hidden;
          padding-left: 1em;
          padding-right: 1em;
        }
        `}</style>

      </div>
    
    );

  }

  const NavigationBar: FC<NavigationBarProps> = ({current,total}) => {

    if (total > 1) {
      return (
        <div className="navigation">
          <BackButton/>
          <Progress total={total} current={current} onClick={ (n) => setCurrentStep(n)}/>
          <NextButton/>

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

  const BackButton : FC = () => {

    if (currentStep > 0 && children.length > 0) {
      return (
        <Button onClick={() => setCurrentStep(currentStep-1)}>
          Back
        </Button>
      );
    } else {
      return (<div></div>);
    }

  }

  const NextButton : FC = () => {

    if (currentStep < children.length-1 ) {
      return(
        <Button onClick={() => setCurrentStep(currentStep+1)}>
          Next
        </Button>
      );
    } else {
      return (<div></div>); 
    }

  }

  return (
    <div className="guide">

      <Head>  
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.1/css/all.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Thambi+2&display=swap" />
      </Head>

      <MDXProvider components={components}>
        <GuideContainer>{children[currentStep]}</GuideContainer>
      </MDXProvider>
      <NavigationBar current={currentStep} total={Array.isArray(children) ? children.length : 0}/>

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

 export default GuidePane