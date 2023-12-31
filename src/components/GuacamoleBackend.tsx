import Guacamole from 'guacamole-common-js'
import { useRef, useEffect, useCallback,useLayoutEffect, useState } from 'react'

import useResizeObserver from '@react-hook/resize-observer'

import encrypt from '../util/encryptToken'

import clipboard from 'clipboardy';

import {Button, Divider, CircularProgress,Backdrop} from '@mui/material'

import { ConnectionSetting } from '../util/users';


const createToken = (width = 1024, height = 768, connectionSettings : ConnectionSetting) : string => {

  const token = {
    "connection": {
      "type": "rdp",
      "settings": {
        "hostname": connectionSettings.host,
        "username": connectionSettings.username,
        "password": connectionSettings.password,
        "enable-drive": false,
        "create-drive-path": false,
        "security": "any",
        "ignore-cert": true,
        "enable-wallpaper": false,
        "width": Math.round(width),
        "height": Math.round(height),
        "resize-method": "display-update"
      }
    }  
  } 

  return encrypt(token)

}

const GUACAMOLE_CLIENT_STATES = {
  STATE_IDLE: 0,
  STATE_CONNECTING: 1,
  STATE_WAITING: 2,
  STATE_CONNECTED: 3,
  STATE_DISCONNECTING: 4,
  STATE_DISCONNECTED: 5
};

export interface GuacamoleBackendProps {
  backendURL: string,
  resizeDelay?: number,
  onStateChange?: (number) => void,
  connectionSettings: ConnectionSetting
}

export default function GuacamoleBackend( {backendURL, resizeDelay = 200, onStateChange, connectionSettings} : GuacamoleBackendProps) {

    // reference to the Guacamole client
    const clientRef = useRef<Guacamole.Client>(null)

    // size of the containing div (updated via useResizeObserver)
    const [size, setSize] = useState<DOMRect>()

    // reference to the containing div 
    const windowRef = useRef<HTMLDivElement>(null)

    // Timer which controls timeot for display size update
    const updateDisplaySizeTimerRef = useRef<NodeJS.Timeout>()

    // State of the Guacamole session
    const [clientState, setClientState] = useState(0);

    // called once the containing div is mounted
    const initDisplay = useCallback( (node : HTMLDivElement) => {
      
      if (node !== null) {

        const url = new URL(backendURL)
        url.searchParams.set("token",createToken(node.clientWidth,node.clientHeight, connectionSettings))

        // Store ref to node
        windowRef.current = node

        // Create tunnel and client
        const tunnel = new Guacamole.WebSocketTunnel(url.toString())
        const client = new Guacamole.Client(tunnel)
        node.appendChild(client.getDisplay().getElement())
        client.connect()
        clientRef.current = client
        console.log("Guacamole client connected")

        // Bind mouse events
        const mouse = new Guacamole.Mouse(client.getDisplay().getElement());
        mouse.onmousemove = (mouseState) => {
          client.sendMouseState(mouseState);
        }
        mouse.onmousedown = mouse.onmouseup = function (mouseState) {
          client.sendMouseState(mouseState);
        };
    
        // Bind keyboard events
        const keyboard = new Guacamole.Keyboard(document);
        keyboard.onkeydown = (keysym) => client.sendKeyEvent(1, keysym);
        keyboard.onkeyup = (keysym) => client.sendKeyEvent(0, keysym);

         // Error handler
        client.onerror = (error) => console.log(error.message);

        // Update state, component knows when to render faders, "Loading..." and so on
        client.onstatechange = (newState) => {
          setClientState(newState);
          if (onStateChange) onStateChange(newState)
        }

      }

    }, [])

    // This effect scales the remote desktop when the containing div changes size
    // @TODO Server-side scaling of the viewport is not supported yet
    useResizeObserver(windowRef, (entry) => {

      // Ignore sub-pixel changes
      if (size && (Math.abs(size.width - entry.contentRect.width) < 1 && Math.abs(size.height - entry.contentRect.height) < 1)) {
        return
      } 
      setSize(entry.contentRect)
    })

    // Ask server to resize if display size changes
    useEffect( () => {
      
      // If we have resize scheduled - cancel it, because we received new insructions
      if (updateDisplaySizeTimerRef.current) {
        clearTimeout(updateDisplaySizeTimerRef.current);
      }

      // Timeout to 500 ms, so that size is updated 0.5 second after resize ends
      updateDisplaySizeTimerRef.current = setTimeout(() => {
        if (size) clientRef.current.sendSize(size.width, size.height);
      }, resizeDelay)
        
    }, [size])

    useEffect(() => {
      return () => {
          // componentwillunmount in functional component.
          // Anything in here is fired on component unmount.
          if (clientRef.current) {
            clientRef.current.disconnect()
            console.log("Guacamole client disconnected")
          } 
      }
    }, [])

   // This effect manages subscribing to clipboard events to manage clipboard synchronization
   useEffect(() => {

    const handleServerClipboardChange = (stream : Guacamole.InputStream, mimetype : string) => {
        // don't do anything if this is not active element
        if (document.activeElement !== windowRef.current)
            return;

        if (mimetype === "text/plain") {
            // stream.onblob = (data) => copyToClipboard(atob(data));
            stream.onblob = (data) => {
                let buf = Buffer.from(data,'base64') 
                let serverClipboard = buf.toString();
                // we don't want action if our knowledge of server cliboard is unchanged
                // and also don't want to fire if we just selected several space character accidentaly
                // which hapens often in SSH session
                if (serverClipboard.trim() !== "") {
                    // put data received form server to client's clipboard
                    clipboard.writeSync(serverClipboard)
                    //navigator.clipboard.writeText(serverClipboard);
                }
            }
        } else {
            // Haven't seen those yet...
            console.log("Unsupported mime type:" + mimetype)
        }
    };

    // Read client's clipboard
    const onFocusHandler = async () => {

        //if (navigator === undefined || navigator.clipboard === undefined || navigator.clipboard.readText === undefined) return

        // when focused, read client clipboard text
        let cb = await clipboard.read()
        
        let stream = clientRef.current.createClipboardStream("text/plain", "clipboard") as Guacamole.OutputStream;
        setTimeout(() => {
            // remove '\r', because on pasting it becomes two new lines (\r\n -> \n\n)
            let buf = Buffer.from(cb.replace(/[\r]+/gm, ""))
            stream.sendBlob(buf.toString('base64'));
        }, 200)
      
    };

    // add handler only when navigator clipboard is available
    // The clipboard API is only available in secure contexts
    if (window.isSecureContext && navigator.clipboard && navigator.clipboard.readText) {
        windowRef.current.addEventListener("focus", onFocusHandler);
        clientRef.current.onclipboard = handleServerClipboardChange;
    } else {
      console.warn("clipboard linking not supported")
    }
  }, [clientRef,windowRef]);

  // Focuses Guacamole Client Display element if it's parent element has been clicked,
  // because div with GuacamoleClient inside otherwise does not focus.
  const parentOnClickHandler = () => {
      windowRef.current.focus();
  };

  const reconnect = () => {
    clientRef.current.connect()
  }

  // Passing a callback as ref to ensure div is mounted
  // initDisplay 
  return (
    <div ref={initDisplay} className="display" tabIndex={1} onClick={parentOnClickHandler}>

      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={clientState < GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}
          style={{position: "absolute"}}>
          <CircularProgress/><span className="statustext">Connecting</span>
      </Backdrop>

      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={clientState > GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}
          style={{position: "absolute"}}>
          <CircularProgress /><span className="statustext">Session disconnected</span>
          {/* {errorMessage &&
          <span style={{color: "red"}}>Error: {errorMessage}</span>}*/}
          <Divider/>

          <Button variant="contained" color="primary" onClick={reconnect}>
              Reconnect
          </Button> 
      </Backdrop>

      <style jsx>{`
        div.display {
          width: 100%;
          height: 100%;
          padding: 0px;
          overflow: hidden;
          cursor: ${(clientState === GUACAMOLE_CLIENT_STATES.STATE_CONNECTED) ? 'none' : 'inherited'};
          z-index: 2;
          position: relative;
        }
        div.display:focus {
          outline: none;
        }
        span.statustext {
          font-size: 24px;
          padding-left: 1em;
          padding-right: 1em;
        }
      `}</style>
    </div>
  )
}