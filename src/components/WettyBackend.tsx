import { useRef } from 'react'

type WettyBackendProps = {
  backendURL: string
}

export default function WettyBackend( { backendURL } : WettyBackendProps ) {

  const iframeRef = useRef(null)

  return (
    <iframe ref={iframeRef} src={backendURL} id="workspace"> 

      <style jsx>{`
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: black;
          padding: 1ex;
        }
      `}</style>
      xw
    </iframe>
  )
}