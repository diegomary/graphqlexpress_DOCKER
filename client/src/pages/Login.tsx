import React, {useState, useContext, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import { store } from '../context/store';
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";

const Login:React.FC  = (props:any) => {  
 
  const globalState = useContext(store);   

  const [loginSuccess, setLoginSuccess] = useState({success:false, authType:""});
  if (globalState.authenticated) {props.history.push("/")}  
  

  const [login, {data}] = useMutation(LOGIN, {
    update(_, {data}) {
      let tokenToSet = `Manual_${data.login.token}`
      localStorage.setItem( "jwt_token", tokenToSet)
      setLoginSuccess({success:true, authType:"manual"});
    },
    onError(err) {
      console.log(err)
    }
  });
  
  const responseGoogle = (response:any) => {
  
    if (isNumeric(response.googleId)) {      
      let tokenToSet = `Google_${response.tokenId}`
      localStorage.setItem("jwt_token", tokenToSet);    
      setLoginSuccess({success:true, authType:"google"});     
    }
  }


  const failureGoogle = (res:any) => {console.log(res)};

  const isNumeric = (n:any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }  


  useEffect(() => { 
    if(loginSuccess.success)  {
      globalState.dispatch({ type: 'LOGIN', payload: loginSuccess.authType});
      props.history.push({ pathname : '/profile'});
    }
    return() => {}
    },[loginSuccess])    

  return (
    
    <div className="App">
        <h1>LOGIN</h1> 
        <div>
          <GoogleLogin
            clientId="118933481211-a6k3dqiuk0l1jv69kbkm89m79rc765vn.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={failureGoogle}
          />
          <button onClick={e => login({ variables: { email:"ayra@email.com", password:"secret" } })}>Login</button>
          <p>Not authenticated</p>
        </div>
      </div>
  );
}


const LOGIN = gql`
  mutation login(
    $email:String!
    $password:String!
  ){
    login(
      loginInput: {
        email:$email
        password:$password
      }
    ) {
      token
    }
  }

`;

export default Login;
