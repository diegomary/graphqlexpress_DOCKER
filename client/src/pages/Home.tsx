import React, {useContext} from 'react';
import { store } from '../context/store';


const Home: React.FC = (props:any) => {  
  const globalState = useContext(store);
 
     
    return (      
        <div>
            <p>Home</p>  
        </div>
    );
  }
  
  export default Home;