import Guacamole from 'guacamole-common-js'
import { useRef, useEffect, useCallback,useLayoutEffect, useState } from 'react'

import useResizeObserver from '@react-hook/resize-observer'

import encrypt from '../util/encryptToken'

const createToken = (width = 1024, height = 768) : string => {

  const token = {
    "connection": {
      "type": "rdp",
      "settings": {
        "hostname": "172.28.1.215",
        "username": "group01",
        "password": "group01",
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
  console.log(token)

  return encrypt(token)

}

export interface GuacamoleBackendProps {
  backendURL: string,
  resizeDelay?: number,
}

export default function GuacamoleBackend( {backendURL, resizeDelay = 200} : GuacamoleBackendProps) {

    // reference to the Guacamole client
    const clientRef = useRef(null)

    // size of the containing div (updated via useResizeObserver)
    const [size, setSize] = useState<DOMRect>()

    // reference to the containing div 
    const windowRef = useRef(null)

    // Timer which controls timeot for display size update
    const updateDisplaySizeTimerRef = useRef<NodeJS.Timeout>()

    // called once the containing div is mounted
    const displayRef = useCallback( node => {
      
      if (node !== null) {

        const url = new URL(backendURL)
        url.searchParams.set("token",createToken(node.clientWidth,node.clientHeight))

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
          if (navigator.userAgent.indexOf('Firefox') === -1) {
            mouseState.x = mouseState.x + 125;
            mouseState.y = mouseState.y + 65;
          }
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

      }

    }, [])

    // Observe size changes
    useResizeObserver(windowRef, (entry) => {

      // Ignore sub-pixel changes
      if (size && (Math.abs(size.width - entry.contentRect.width) < 1 && Math.abs(size.height - entry.contentRect.height) < 1)) {
        return
      } 

      // If we have resize scheduled - cancel it, because we received new insructions
      if (updateDisplaySizeTimerRef.current) {
        clearTimeout(updateDisplaySizeTimerRef.current);
      }

      // Timeout to 500 ms, so that size is updated 0.5 second after resize ends
      updateDisplaySizeTimerRef.current = setTimeout(() => {
          setSize(entry.contentRect)
      }, resizeDelay)
    })

    // Ask server to resize if display size changes
    useEffect( () => {
        if (size) clientRef.current.sendSize(size.width, size.height);
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

  return <div ref={displayRef} className="display">
    <style jsx>{`
      div.display {
        width: 100%;
        height: 100%;
        padding: 0px;
        overflow: hidden;
        cursor: none;
      }
    `}</style>
  </div>

}