import React from 'react'
import Highlight, {defaultProps} from 'prism-react-renderer'

import theme from "prism-react-renderer/themes/vsDark";
theme.plain.borderRadius = "5px";

const CodeBlock = ({children, className}) => {

  const language = className.replace(/language-/, '')

  return (

    <Highlight {...defaultProps} code={children} language={language} theme={theme}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style, padding: '20px'}}>
          {tokens.filter((line,i,arr) => (i < arr.length-1)).map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  
  )
}

export default CodeBlock;