import React, {useContext} from 'react';
import { store } from '../context/store';


const Discover: React.FC = (props:any) => {  
  const globalState = useContext(store);
  if (!globalState.authenticated) {props.history.push("/"); return null;}
     
    return (      
        <div>
            <p>Discover</p>  
        </div>
    );
  }
  
  export default Discover;
  