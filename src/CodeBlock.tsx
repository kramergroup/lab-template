import { useEffect, FC, ReactNode, useState } from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'

import theme from "prism-react-renderer/themes/vsDark";

theme.plain.borderRadius = "5px";

interface SyntaxHighlighterProps {
  code: string,
  language: Language
}

interface CodeBlockProps {
  children? : ReactNode[],
  className : string
}

const SyntaxHighlighter : FC<SyntaxHighlighterProps> = ({code,language}) => {

  return (
    <Highlight {...defaultProps} code={code} language={language} theme={theme}>
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

const CodeBlock : FC<CodeBlockProps> = ({children, className}) => {

  // This is needed to circumvent a hydration error. See: https://stackoverflow.com/questions/71706064/react-18-hydration-failed-because-the-initial-ui-does-not-match-what-was-render
  const [language, setLanguage] = useState<Language>()
  useEffect(() => {
    if (className) setLanguage(className.replace(/language-/, '') as Language)
  },[])

  return (
    (language) ? <SyntaxHighlighter code={children as unknown as string} language={language}/> : <code className={className}>{children}</code>
  )

}

export default CodeBlock;