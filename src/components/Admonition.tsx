import React, { ReactNode } from 'react'

import { AdmonitionStyles } from './AdmonitionStyles'

import { FaKeyboard, FaInfoCircle, FaHandPointRight } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";

const stylings : AdmonitionStyles = {
  info: {
    backgroundColor: "var(--main-cm-color)",
    color: "var(--main-bg-color)",
    linkColor: "var(--high-hl-color)",
    hoverColor: "var(--high-cm-color)",
    icon: FaInfoCircle,
    defaultTitle: "Info"
  },
  warn: {
    backgroundColor: "var(--main-al-color)",
    color: "var(--main-bg-color)",
    linkColor: "var(--main-cm-color)",
    hoverColor: "var(--high-cm-color)",
    icon: IoMdWarning,
    defaultTitle: "Warning"
  },
  action: {
    backgroundColor: "#eee",
    color: "var(--main-fg-color)",
    linkColor: "var(--main-cm-color)",
    hoverColor: "var(--high-cm-color)",
    icon: FaKeyboard,
    defaultTitle: "Action"
  },
  tip: {
    backgroundColor: "var(--main-hl-color)",
    color: "white",
    linkColor: "var(--main-cm-color)",
    hoverColor: "var(--high-cm-color)",
    icon: FaHandPointRight,
    defaultTitle: "Tip"
  }
}

type Status = keyof AdmonitionStyles

type Props = {
  status?: Status
  children?: React.ReactNode[]
  className?: string
}

export default function Admonition({ status = "info", children }: Props) {

  type TitleProps = {
    children?: React.ReactNode,
  }

  const Icon = stylings[status].icon

  const Title = ( {children} : TitleProps ) => {
    return (
      <div>
        <span className="icon"><Icon/></span>
        <span className="title">{children}</span>

        <style jsx>{`
          span.title {
            margin-top: 0px;
            margin-left: 0px;
            font-weight: 900;
          }
          span.icon {
            padding-right: 0.6ex;
            vertical-align: -2pt;
          }
        `}</style>
      </div>
    )
  }

  const isPrimitive = ( t : ReactNode ) : t is (string | number | boolean) => {
    return typeof t === "string" || typeof t === "number" || typeof t === "boolean"
  }

  const isTitle = (c : ReactNode) => {
    return !isPrimitive(c) && "props" in c && c.props.title
  }

  const getTitle = () : ReactNode | undefined => {
    //const t = children.find(c => (!isPrimitive(c)) && "props" in c && c.props.title)
    const t = (Array.isArray(children)) ? children.find(c => (isTitle(c))) : stylings[status].defaultTitle  
    if (t === undefined) return undefined
    
    return (!isPrimitive(t) && "props" in t) ? t.props.children : t
  }

  return (
    <aside>
      <div className="container">
        {(getTitle() !== undefined) ? <Title>{getTitle()}</Title> : <></>}
        {Array.isArray(children) ? children.filter( c => !isTitle(c)) : children}
      </div>

      <style jsx>{`

        .container {
          background: ${stylings[status].backgroundColor};
          color:${stylings[status].color};
          box-shadow: 2px 2px rgba(0, 0, 0, 0.2);
        }

        .container :global(a) {
          color: ${stylings[status].linkColor};
        }

        .container :global(a:hover) {
          color: ${stylings[status].hoverColor};
        }

        .container {
          border-radius: 5px;
          padding: 1ex;
          margin-top: 1ex;
          margin-bottom: 1ex;
        }
                        
        .container > :global(p) {
          margin-top: 1ex;
          margin-bottom: 1ex;
          margin-left: 1.5em;
        }

        .container > :global(pre) {
          margin-left: 1.5em;
          margin-right: 0.75em;
        }
        
        .container > :global(ol) {
          margin-left: 0px !important;
        }
        
        .container > :global(p:last-of-type) {
          margin-bottom: 1ex;
        }
        
      `}</style>

    </aside>
  )
}
