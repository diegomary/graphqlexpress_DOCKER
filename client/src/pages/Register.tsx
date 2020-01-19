import React, {useState, useContext, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import { store } from '../context/store';
import { useForm } from "react-hook-form";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import './Register.scss';

const Register:React.FC  = (props:any) => { 
  
  const[registeredSuccess,setRegisteredSuccess] = useState({success:false, authType:""});
  
    const SIGNUP = gql`
    mutation signUp(
      $email:String!
      $username:String!
      $password:String!
      $authType:String!
    ){
      signUp(
        registerInput: {
          username:$username
          email:$email
          password:$password
          authType:$authType
        }
      ) {
        token
      }
    }`;

    const [googleStatus, setGoogleStatus] = useState({token:"", acquired:false,email:""});
    const { register, handleSubmit, watch, errors } = useForm();       

    const globalState = useContext(store);   
    if (globalState.authenticated) {props.history.push("/")}

   const [signUp, {loading,data,error}] = useMutation(SIGNUP, {     
    update(_, {data}) {
      if (googleStatus.acquired) {
        let tokenToSet = `Google_${googleStatus.token}`
        localStorage.setItem( "jwt_token", tokenToSet);
        setRegisteredSuccess({success:true, authType:"google"});    
      }
      else {
        let tokenToSet = `Manual_${data.signUp.token}`
        localStorage.setItem( "jwt_token", tokenToSet);
        setRegisteredSuccess({success:true, authType:"manual"});    
      }    
      
      console.log(data);
    },
    onError(err) {
    console.log(err)
    }
});

   const onSubmitManual = (formData:any) => {

    signUp({ variables: {...formData, authType:"manual"} });
    console.log(formData);
  }; 

  const onSubmitGoogle = (formData:any) => {

    signUp({ variables: {
      username:formData.google_username, 
      password:formData.google_password,
      authType:"google",
      email:googleStatus.email
    } });
    console.log(formData);
  }; 


    const responseGoogle = (response:any) => {  
        if (isNumeric(response.googleId)) { 
            setGoogleStatus({token:response.tokenId, acquired:true, email:response.profileObj.email}); 
        }
    }

    const isNumeric = (n:any) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }  

    const failureGoogle = (res:any) => {console.log(res)};


    useEffect(() => { 
      if(registeredSuccess.success)  {
        globalState.dispatch({ type: 'LOGIN', payload: registeredSuccess.authType});
        props.history.push({ pathname : '/profile'});
      }
      return() => {

      }
      },[registeredSuccess])    

  return (
    
    <div>
        <h1>SIGN UP</h1>      
            {googleStatus.acquired ? 
              (<div>
                {googleStatus.token}
                <form name="form-google" className = "google-signup-form" onSubmit={handleSubmit(onSubmitGoogle)}>
                  <input type="text" name="google_username" placeholder="insert valid username"  ref={register({ required: true, maxLength: 15 })} ></input>
                  {errors.google_username && <p>username is required</p>}
                  <input type="password" name = "google_password"  placeholder="insert valid password" ref={register({ required: true })} ></input>
                  {errors.google_password && <p>password is required</p>}
                  <input name="google_passwordmatch" type="password" placeholder="passwords must match" ref={register({required: true, validate: value => value === watch("google_password")})}/>
                  {errors.google_passwordmatch && <p>passwords do not match</p>}
                  <input type="submit" ></input>
                </form>
              </div>) : (
              <div>
                <div>
                  <GoogleLogin
                  clientId="118933481211-a6k3dqiuk0l1jv69kbkm89m79rc765vn.apps.googleusercontent.com"
                  buttonText="SIGN UP WITH GOOGLE"
                  onSuccess={responseGoogle}
                  onFailure={failureGoogle}/>  
                </div>
                <div>
                  <form name="form-manual" className = "manual-signup-form" onSubmit={handleSubmit(onSubmitManual)}>
                    <input type="text" name="username" placeholder="insert valid username"  ref={register({ required: true, maxLength: 15 })} ></input>
                    {errors.username && <p>username is required</p>}                  
                    <input type="text" name ="email"   placeholder="insert valid email" ref={register({ required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,})}></input>
                    {errors.email && <p>please insert a valid email</p>}
                    <input type="password" name = "password"  placeholder="insert valid password" ref={register({ required: true })} ></input>
                    {errors.password && <p>password is required</p>}
                    <input name="passwordmatch" type="password" placeholder="passwords must match" ref={register({required: true, validate: value => value === watch("password")})}/>
                    {errors.passwordmatch && <p>passwords do not match</p>}
                    <input type="submit" ></input>
                  </form>
                </div>                
              </div>
            )
            }      
      
      </div>
  );
}




export default Register;
