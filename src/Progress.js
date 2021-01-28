import { Component } from "react";

import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Progress extends Component {

  constructor(props) {
    super(props);
  }

  Dots(props) {
    let dots = []
    for (let n=0;n<props.total;n++) {

      const cl = (n == props.active) ? "indicator active" : "indicator";
      dots.push(
        <div className={cl} key={n}>
          <FontAwesomeIcon icon={faCircle} />
          <style jsx>{`
            .indicator {
              width: 0.5rem;
              height: 0.5rem;
              color: #ddd;
              margin-left: 1rem;
              transform: translate(0px, -0.5em);
            }
            .active {
              color: blue;
            }
          `}</style>
        </div>
      )
    }
    return dots;
  }

  render() {

    return(
      <div className="progress">
        
        <div className="dots">
          <this.Dots total={this.props.total} active={this.props.current} />
        </div>

        <style jsx>{`
          
          .dots {
            display: flex;
            flex-direction: row;
            justify-content: left;
            max-width: 100vh;
          }
          .progress {
            margin: auto;
          }
        `}</style>

      </div>
    );

  }

}

export default Progress;