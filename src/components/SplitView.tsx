import { ReactNode, useState } from "react"

import GuidePane from "./GuidePane"
import ToggleViewButton from "./ViewToggleButton"

export type BackendType = "wetty" | "guacamole"

export interface SplitViewProps {

  showGuidance?: boolean,
  children?: ReactNode[],
  backendType: BackendType,
  backendURL: string,
}

export default function SplitView( {children, backendType, backendURL, showGuidance = true} : SplitViewProps) {

  const [guidanceVisible,setGuidanceVisible] = useState(showGuidance)
  
  const Backend = () => {
    if (backendType === "wetty") return <iframe src={backendURL} id="workspace" />
    if (backendType === "guacamole") return <div id="workspace">Not implemented yet</div>
    return <></>
  }

  return (
  <main>
    <ToggleViewButton splitView={guidanceVisible} onClick={() => setGuidanceVisible(!guidanceVisible)}/>
    <div className="workspace">
      <Backend/>
    </div>
    <div className="guide" style={{display: guidanceVisible ? 'block' : 'none' }}>
      <GuidePane>
        {children}
      </GuidePane>
    </div>

    <style jsx>{`
      main {
        display: flex;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        position: absolute;
      }
      .guide {
        flex-grow: 1;
        width: 30%;
        min-width: 350px;
        height: 100vh;
        border-left: #ddd solid 1px;
        margin-top:0px;
        margin-bottom:0px;
      }
      .workspace {
        flex-grow: 8;
        background: #ddd;
        height: 100vh;
        overflow: hidden;
        padding: 1ex;
        background: black;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    `}</style>
  </main>
  )

}