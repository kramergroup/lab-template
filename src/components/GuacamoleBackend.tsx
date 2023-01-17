import Guacamole from 'guacamole-common-js'
import { useRef, useEffect, useCallback,useLayoutEffect, useState, FocusEventHandler } from 'react'

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

  return encrypt(token)

}

export interface GuacamoleBackendProps {
  backendURL: string,
  resizeDelay?: number,
}

export default function GuacamoleBackend( {backendURL, resizeDelay = 200} : GuacamoleBackendProps) {

    // reference to the Guacamole client
    const clientRef = useRef<Guacamole.Client>(null)

    // size of the containing div (updated via useResizeObserver)
    const [size, setSize] = useState<DOMRect>()

    // reference to the containing div 
    const windowRef = useRef<HTMLDivElement>(null)

    // Timer which controls timeot for display size update
    const updateDisplaySizeTimerRef = useRef<NodeJS.Timeout>()

    // called once the containing div is mounted
    const initDisplay = useCallback( (node : HTMLDivElement) => {
      
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
                    navigator.clipboard.writeText(serverClipboard);
                }
            }
        } else {
            // Haven't seen those yet...
            console.log("Unsupported mime type:" + mimetype)
        }
    };

    // Read client's clipboard
    const onFocusHandler = () => {
        // when focused, read client clipboard text
        navigator.clipboard.readText().then(
            (cb) => {
              console.log(cb)
              let stream = clientRef.current.createClipboardStream("text/plain", "clipboard") as Guacamole.OutputStream;
              setTimeout(() => {
                  // remove '\r', because on pasting it becomes two new lines (\r\n -> \n\n)
                  let buf = Buffer.from(cb.replace(/[\r]+/gm, ""))
                  stream.sendBlob(buf.toString('base64'));
              }, 200)
            }
        )
    };

    // add handler only when navigator clipboard is available
    if (navigator.clipboard) {
        windowRef.current.addEventListener("focus", onFocusHandler);
        clientRef.current.onclipboard = handleServerClipboardChange;
        console.log(windowRef.current)
    } else {
      console.warn("clipboard linking not supported")
    }
  }, [clientRef,windowRef]);

   // Focuses Guacamole Client Display element if it's parent element has been clicked,
    // because div with GuacamoleClient inside otherwise does not focus.
    const parentOnClickHandler = () => {
        windowRef.current.focus();
    };

  // Passing a callback as ref to ensure div is mounted
  // initDisplay 
  return <div ref={initDisplay} className="display" tabIndex={1} onClick={parentOnClickHandler}>
    <style jsx>{`
      div.display {
        width: 100%;
        height: 100%;
        padding: 0px;
        overflow: hidden;
        cursor: none;
        z-index: 2:
      }
      div.display:focus {
        outline: none;
      }
    `}</style>
  </div>

}