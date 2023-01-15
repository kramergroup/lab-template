import { ReactNode, useState } from "react"

import GuidePane from "./GuidePane"
import ToggleViewButton from "./ViewToggleButton"
import WettyBackend from "./WettyBackend"

export type BackendType = "wetty" | "guacamole"

export interface SplitViewProps {

  showGuidance?: boolean,
  children?: ReactNode[],
  backendType: BackendType,
  backendURL: string,
}

export default function SplitView( {children, backendType, backendURL, showGuidance = true} : SplitViewProps) {

  const Backend = () => {
    if (backendType === "wetty") return <WettyBackend backendURL={backendURL} />
    if (backendType === "guacamole") return <div id="workspace">Not implemented yet</div>
    return <></>
  }

  const Guide = () => {

    const [guidanceVisible,setGuidanceVisible] = useState(showGuidance)
  
    return (
      <>
      <div className="guide" style={{display: guidanceVisible ? 'block' : 'none' }}>
        <GuidePane>
          {children}
        </GuidePane>
      </div>
      <ToggleViewButton splitView={guidanceVisible} onClick={() => setGuidanceVisible(!guidanceVisible)}/>

      <style jsx>{`
        .guide {
          flex-grow: 1;
          width: 30%;
          min-width: 350px;
          height: 100vh;
          border-left: #ddd solid 1px;
          margin-top:0px;
          margin-bottom:0px;
        }
      `}</style>
      </>
    )
  }

  return (
  <main>
    
    <div className="workspace">
      <Backend/>
    </div>
    <Guide/>

    <style jsx>{`
      main {
        display: flex;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        position: absolute;
      }
      .workspace {
        flex-grow: 8;
        background: #ddd;
        height: 100vh;
        overflow: hidden;
        padding: 1ex;
        background: black;
      }
    `}</style>
  </main>
  )

}