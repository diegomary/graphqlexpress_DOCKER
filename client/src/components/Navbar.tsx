import React, {useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import { store } from '../context/store';
import {GoogleLogout} from 'react-google-login';

const Navbar: React.FC = (props:any) => { 
    
    const globalState = useContext(store); 
    useEffect(() => {    
        const persistedAppState =  JSON.parse(localStorage.getItem("appState") as string);
        if(persistedAppState) {  
          globalState.dispatch({ type: 'LOGIN', payload: persistedAppState.authType });      
        }
        return  () => {}
      },[])  

    const logout = () => {  
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("appState");
        globalState.dispatch({ type: 'LOGOUT' })
      }

    const logoutButton = globalState.authType === "google" ? (
        <GoogleLogout
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}/>
      ):(
        <button onClick = {logout}>Logout</button>
      )


         
    return (      
        <nav>
            <ul>
                <li><Link to = "/"><button>Home</button></Link></li>
                <li><Link to = "/login"><button>Login</button></Link></li>
                <li><Link to = "/register"><button>Register</button></Link></li>
                <li><Link to = "/profile"><button>Profile</button></Link></li>
                <li><Link to = "/discover"><button>Discover</button></Link></li>                
            </ul>
            {globalState.authenticated === true ? (<div> {logoutButton} </div> ) : null}
        </nav>
    );
  }
  
  export default Navbar;
  