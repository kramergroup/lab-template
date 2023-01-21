import { ReactNode, useState, useRef } from "react"

import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

import GuidePane from "./GuidePane"
import ToggleViewButton from "./ViewToggleButton"

import WettyBackend from "./WettyBackend"
import GuacamoleBackend from "./GuacamoleBackend"
import GuacViewer from "./GuacViewer"

import LoginWindow from "./LoginWindow"
import { useLocalStorage } from "../util/useLocalStorage"
import { authenticateUser,getConnectionSettings } from "../util/users"

export type BackendType = "wetty" | "guacamole"

const LoginContainer = styled(Box)`
position: relative;
width: 100%;
height: 100%;
`
export interface SplitViewProps {

  showGuidance?: boolean,
  children?: ReactNode[],
  backendType: BackendType,
  backendURL: string,

}

export default function SplitView( {children, backendType, backendURL, showGuidance = true} : SplitViewProps) {

  // const [credentials,setCredentials] = useLocalStorage<{username:string,password:string}>('credentials',{username: undefined, password: undefined})

  const [username,setUsername] = useLocalStorage<string>("auth-token",undefined,true)
  

  const Backend = () => {
    if (backendType === "wetty") return <WettyBackend backendURL={backendURL} />
    // if (backendType === "guacamole") return <GuacViewer backendURL={backendURL} />
    if (backendType === "guacamole") return <GuacamoleBackend backendURL={backendURL} connectionSettings={getConnectionSettings(username)}/>
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

  const handleLogin = (username:string, password: string) => {

    if ( authenticateUser(username,password) ) {
      setUsername(username)
      return true
    }
    return false
  }

  return (
  <main>
    
    <div className="workspace">
      {(username) ? <Backend/> : <LoginContainer>
        <LoginWindow className="loginwindow"
                     onLogin={handleLogin}/>
        </LoginContainer>}
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
        width: 70%;
        overflow: hidden;
        padding: 0ex;
        background: transparent;
      }

    `}</style>
  </main>
  )

}