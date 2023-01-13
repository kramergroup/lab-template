import GuidePane from './GuidePane';
import { Component } from 'react';

import ToggleViewButton from './ViewToggleButton'

class SplitView extends Component {

  state = {splitView: true};

  toggleView = () => {
    this.setState(prevState => ({ splitView: !prevState.splitView }));
  }

  render() {
    return <main>
      <ToggleViewButton splitView={this.state.splitView} onClick={this.toggleView}/>
      <div className="workspace">
        {/* <iframe src={this.props.backend} id="workspace" /> */}
      </div>
      <div className="guide" style={{display: this.state.splitView ? 'block' : 'none' }}>
        <GuidePane>
          {this.props.children}
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
  }
}

export default SplitView;