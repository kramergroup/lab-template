import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Fab from '@mui/material/Fab';


const Icon = (props) => {
  return (props.splitView) ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />;
}

const ViewToggleButton = (props) => {

    return (
      <main>
        
        <Fab color="primary" aria-label="toggle guide" size="small" onClick={props.onClick}>
          <Icon splitView={props.splitView}/>
        </Fab>

        <style jsx>{`
          main {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
          }`}
        </style>

      </main>
    )           

}

export default ViewToggleButton;