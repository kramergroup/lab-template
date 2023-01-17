import React, {useCallback, useEffect, useRef, useState} from 'react';
import Guacamole from 'guacamole-common-js'

import encrypt from '../util/encryptToken'

import {Button, Divider, CircularProgress,Backdrop} from '@mui/material'

const GUACAMOLE_CLIENT_STATES = {
  STATE_IDLE: 0,
  STATE_CONNECTING: 1,
  STATE_WAITING: 2,
  STATE_CONNECTED: 3,
  STATE_DISCONNECTING: 4,
  STATE_DISCONNECTED: 5
};

const GUACAMOLE_STATUS = {
  0: {
      name: "SUCCESS",
      text: "The operation succeeded. No error."
  },
  256: {
      name: "UNSUPPORTED",
      text: "The requested operation is unsupported."
  },
  512: {
      name: "SERVER_ERROR"
      , text: "An internal error occurred, and the operation could not be performed."
  },
  513: {
      name: "SERVER_BUSY",
      text: "The operation could not be performed because the server is busy."
  },
  514: {
      name: "UPSTREAM_TIMEOUT",
      text: "The upstream server is not responding. In most cases, the upstream server is the remote desktop server."
  },
  515: {
      name: "UPSTREAM_ERROR",
      text: "The upstream server encountered an error. In most cases, the upstream server is the remote desktop server."
  },
  516: {
      name: "RESOURCE_NOT_FOUND",
      text: "An associated resource, such as a file or stream, could not be found, and thus the operation failed."
  },
  517: {
      name: "RESOURCE_CONFLICT",
      text: "A resource is already in use or locked, preventing the requested operation."
  },
  518: {
      name: "RESOURCE_CLOSED",
      text: "The requested operation cannot continue because the associated resource has been closed."
  },
  519: {
      name: "UPSTREAM_NOT_FOUND",
      text: "The upstream server does not appear to exist, or cannot be reached over the network. In most cases, the upstream server is the remote desktop server."
  },
  520: {
      name: "UPSTREAM_UNAVAILABLE",
      text: "The upstream server is refusing to service connections. In most cases, the upstream server is the remote desktop server."
  },
  521: {
      name: "SESSION_CONFLICT",
      text: "The session within the upstream server has ended because it conflicts with another session. In most cases, the upstream server is the remote desktop server."
  },
  522: {
      name: "SESSION_TIMEOUT",
      text: "The session within the upstream server has ended because it appeared to be inactive. In most cases, the upstream server is the remote desktop server."
  },
  523: {
      name: "SESSION_CLOSED",
      text: "The session within the upstream server has been forcibly closed. In most cases, the upstream server is the remote desktop server."
  },
  768: {
      name: "CLIENT_BAD_REQUEST",
      text: "The parameters of the request are illegal or otherwise invalid."
  },
  769: {
      name: "CLIENT_UNAUTHORIZED",
      text: "Permission was denied, because the user is not logged in. Note that the user may be logged into Guacamole, but still not logged in with respect to the remote desktop server."
  },
  771: {
      name: "CLIENT_FORBIDDEN",
      text: "Permission was denied, and logging in will not solve the problem."
  },
  776: {
      name: "CLIENT_TIMEOUT",
      text: "The client (usually the user of Guacamole or their browser) is taking too long to respond."
  },
  781: {
      name: "CLIENT_OVERRUN",
      text: "The client has sent more data than the protocol allows."
  },
  783: {
      name: "CLIENT_BAD_TYPE",
      text: "The client has sent data of an unexpected or illegal type."
  },
  797: {
      name: "CLIENT_TOO_MANY",
      text: "The client is already using too many resources. Existing resources must be freed before further requests are allowed."
  },

};

/***
 * 
 * @param token - object specifying connection parameters
 * 
 * @returns {string} - encrypted JSON serialisation of the connection parameter object
 */
const createToken = () => {

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
            "resize-method": "display-update"
        }
    }
}

return encrypt(token)

}

/***
 *
 * @param backendURL - URL of websocket with guacadmin server
 * @param controlSize - bool to specify if this GuacViewer should try to control size (send resize commands)
 * @param screenSize - if set to null, uses automatic adjustment, otherwise uses {width, height} properties from object
 *
 * @returns {*}
 * @constructor
 */
function GuacViewer({backendURL, controlSize = true, controlInput = true, screenSize = null}) {

    const displayRef = useRef(null);
    const guacRef = useRef(null);
    const connectParamsRef = useRef({});
    const scale = useRef(1);
    const demandedScreenSize = useRef(0);

    // Timer which controls timeot for display size update
    const updateDisplaySizeTimerRef = useRef(0);


    const [clientState, setClientState] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);

    // updates scale factor given new actual display width/height
    const rescaleDisplay = useCallback(() => {
        // get current width/height of connection
        let remoteDisplayWidth = guacRef.current.getDisplay().getWidth();
        let remoteDisplayHeight = guacRef.current.getDisplay().getHeight();

        if (!displayRef.current) {
            return;
        }

        let newWidth = displayRef.current.clientWidth;
        let newHeight = displayRef.current.clientHeight;

        // calculate which scale should we use - width or height, in order to see all of remote display
        let newScale = Math.min(newWidth / remoteDisplayWidth, newHeight / remoteDisplayHeight, 1);

        guacRef.current.getDisplay().scale(newScale);
        scale.current = newScale;
    }, []);

    // Display size update handler, currently implement onli logging to console
    const updateDisplaySize = useCallback((timeout, widthparam, heightparam) => {

        if (!guacRef.current)
            return;

        // If we have resize scheduled - cancel it, because we received new insructions
        if (updateDisplaySizeTimerRef.current) {
            clearTimeout(updateDisplaySizeTimerRef.current);
        }

        let newDisplayWidth = 0;
        let newDisplayHeight = 0;

        // Timeout to 500 ms, so that size is updated 0.5 second after resize ends
        updateDisplaySizeTimerRef.current = setTimeout(() => {

            // if we are provided with widthparam/heightparam upfront - use them
            if (widthparam > 0 && heightparam > 0) {
                newDisplayWidth = widthparam;
                newDisplayHeight = heightparam;
            } else if (displayRef.current) {
                // otherwise we can measure client size of display element and use it
                // this is usually needed when we are connecting

                newDisplayWidth = displayRef.current.clientWidth;
                newDisplayHeight = displayRef.current.clientHeight;
            }

            // save new width/height for reconnect purposes
            connectParamsRef.current.width = newDisplayWidth;
            connectParamsRef.current.height = newDisplayHeight;

            if (newDisplayWidth > 1 && newDisplayHeight > 1) {
                if (controlSize) {
                    if (demandedScreenSize.current) {
                        guacRef.current.sendSize(demandedScreenSize.current.width, demandedScreenSize.current.height);
                    } else {
                        guacRef.current.sendSize(newDisplayWidth, newDisplayHeight);
                    }

                    // we sent resize command and possiblty resolution will be update
                    // take a timeout to see the updated resolution of GuacamoleClient dispalay
                    setTimeout(() => {
                        rescaleDisplay()
                    }, 500);
                } else {
                    // We do not have control over display size, it means GuacamoleClient display will not change
                    // so we can rescale display right away
                    rescaleDisplay();
                }
            }

        }, timeout > 0 ? timeout : 500);
    }, [controlSize, rescaleDisplay]);


    // // Focuses Guacamole Client Display element if it's parent element has been clicked,
    // // because div with GuacamoleClient inside otherwise does not focus.
    // const parentOnClickHandler = () => {
    //     displayRef.current.focus();

    //     // nodeSelectCallback - make the node hosting this component active if this component is clicked
    //     if (nodeSelectCallback) {
    //         nodeSelectCallback(node._attributes.id);
    //     }
    // };

    // useEffect(() => {

    //     // Subscribe to FlexLayout node visibility event
    //     // if visibility has changed, and element became visible, there is a great chance it became visible because
    //     // of tab beeing activated. That is a nice occasion to focus on tab.
    //     // Timeout is needed because "visibility" event is fired before the tab name gets focus,
    //     // so we schedule 100 ms after event and take back focus from tab name element
    //     const visibilityChangedCallback = (p) => {
    //         if (p.visible) {
    //             setTimeout(() => {
    //                 displayRef.current.focus();
    //                 updateDisplaySize(50);
    //             }, 100);
    //         }
    //     };
    //     node.setEventListener("visibility", visibilityChangedCallback);

    //     // Subscribe to FlexLayout node resize event.
    //     // This will provide use updated size of visible recangle
    //     // Event is fired before actual resize happens, and provides with new dimensions (rect)
    //     const updateDisplaySizeCallback = (rect) => {
    //         updateDisplaySize(0, rect.width, rect.height);
    //     };

    //     node.setEventListener("resize", updateDisplaySizeCallback);

    //     // Specify how to cleanup after this effect
    //     return () => {
    //         node.removeEventListener("visibility", visibilityChangedCallback);
    //         node.removeEventListener("resize", updateDisplaySizeCallback);
    //     }

    // }, [node, updateDisplaySize]);


    // Main effect which constructs GuacamoleClient
    // should reaaaly be run only once
    useEffect(() => {
        // Determine websocket URI
        const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        const url = new URL(backendURL)
         url.searchParams.set("token",createToken())

        guacRef.current = new Guacamole.Client(new Guacamole.WebSocketTunnel(url.toString()));

        displayRef.current.appendChild(guacRef.current.getDisplay().getElement());

        // Error handler
        guacRef.current.onerror = function (error) {
            let msg = error.message;

            if (GUACAMOLE_STATUS[error.code]) {
                msg = <p>
                    {error.message}<br/>
                    {GUACAMOLE_STATUS[error.code].name}<br/>
                    {GUACAMOLE_STATUS[error.code].text}
                </p>
            }

            setErrorMessage(msg);
        };

        // Update state, component knows when to render faders, "Loading..." and so on
        guacRef.current.onstatechange = (newState) => {
            setClientState(newState);
        };

        // Setup connection parameters, like resolution and supported audio types
        let connectionParams = {
            audio: []
        };

        // if current instance is allowed to control remote display size - include window size in connection info
        if (controlSize) {
            connectionParams.width = displayRef.current.clientWidth;
            connectionParams.height = displayRef.current.clientHeight;
        }

        let supportedAudioTypes = Guacamole.AudioPlayer.getSupportedTypes();
        if (supportedAudioTypes.length > 0) {
            connectionParams.audio = supportedAudioTypes.map(item => item + ";rate=44100,channels=2")
        }

        // Set connection parameters as we will use them later to reconnect
        connectParamsRef.current = connectionParams;

        // Everything has been setup - we can initiate connection
        guacRef.current.connect();

        // Specify how to clean up after this effect:
        return function cleanup() {
            // Disconnect Guacamole Client, so server know'w we don't need any updates and teminates connection
            // to server
            guacRef.current.disconnect();
        };

    }, [backendURL, updateDisplaySize, controlSize]);

    // This effect fires when "screenSize" prop has changed, which mean either
    // demanded resolution was change of set to Auto
    useEffect(() => {
        demandedScreenSize.current = screenSize;

        if (screenSize) {
            updateDisplaySize(100, demandedScreenSize.current.width, demandedScreenSize.current.height)
        } else {
            updateDisplaySize();
        }
    }, [updateDisplaySize, screenSize]);

    // This effect creates Guacamole.Keyboard / Guacamole.Mouse on current display element and binds callbacks
    // to current guacamole client
    useEffect(() => {
        // don't bind to events if we know this input will not be accepted at server side
        if (!controlInput) {
            return;
        }

        // Keyboard
        let keyboard = new Guacamole.Keyboard(displayRef.current);

        const fixKeys = (keysym) => {
            // 65508 - Right Ctrl
            // 65507 - Left Ctrl
            // somehow Right Ctrl is not sent, so send Left Ctrl instead
            if (keysym === 65508) return 65507;

            return keysym
        };

        keyboard.onkeydown = function (keysym) {
          console.log("key down")
            guacRef.current.sendKeyEvent(1, fixKeys(keysym));
        };

        keyboard.onkeyup = function (keysym) {
            guacRef.current.sendKeyEvent(0, fixKeys(keysym));
        };

        // Mouse
        let mouse = new Guacamole.Mouse(displayRef.current);


        mouse.onmousemove = function (mouseState) {
            mouseState.x = mouseState.x / scale.current;
            mouseState.y = mouseState.y / scale.current;
            guacRef.current.sendMouseState(mouseState);
        };

        mouse.onmousedown = mouse.onmouseup = function (mouseState) {
            guacRef.current.sendMouseState(mouseState);
        };


    }, [controlInput]);

    // Thi effect  binds to server side resize event
    useEffect(() => {
        if (!controlSize) {
            guacRef.current.getDisplay().onresize = (x, y) => {
                console.log(`Server changed size: ${x} x ${y}`);
                updateDisplaySize(0, x, y);
            }
        }
    }, [controlSize, updateDisplaySize]);

    // This effect manages subscribing to clipboard events to manage clipboard synchronization
    useEffect(() => {

        const handleServerClipboardChange = (stream, mimetype) => {
            // don't do anything if this is not active element
            if (document.activeElement !== displayRef.current)
                return;

            if (mimetype === "text/plain") {
                // stream.onblob = (data) => copyToClipboard(atob(data));
                stream.onblob = (data) => {
                    let serverClipboard = atob(data);
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
                (clientClipboard) => {
                    let stream = guacRef.current.createClipboardStream("text/plain", "clipboard");
                    setTimeout(() => {
                        // remove '\r', because on pasting it becomes two new lines (\r\n -> \n\n)
                        stream.sendBlob(btoa(unescape(encodeURIComponent(clientClipboard.replace(/[\r]+/gm, "")))));
                    }, 200)
                }
            )
        };

        // add handler only when navigator clipboard is available
        if (navigator.clipboard) {
            displayRef.current.addEventListener("focus", onFocusHandler);
            guacRef.current.onclipboard = handleServerClipboardChange;
        }
    }, []);

    const reconnect = () => {
        setErrorMessage(null);
        guacRef.current.connect();
    };

    return (
        <React.Fragment>
            <div ref={displayRef}
                 className="display"
                 style={{
                     width: "100%",
                     height: "100%",
                     overflow: "hidden",
                     cursor: "none"
                 }}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={clientState < GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}>
                <CircularProgress/>
                
            </Backdrop>

            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={clientState > GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}>
                <CircularProgress /><div style={{marginLeft: "1em", fontSize: "26px"}}>Session disconnected</div>
                {errorMessage &&
                <span style={{color: "red"}}>Error: {errorMessage}</span>}
                <Divider/>

                <Button inverted color='green' onClick={reconnect}>
                    Reconnect
                </Button>
            </Backdrop> */}
        </React.Fragment>
    );
}

export default GuacViewer;

