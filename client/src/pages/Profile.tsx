import React, {useContext} from 'react';
import { useQuery } from '@apollo/react-hooks';
import  gql  from 'graphql-tag';
import { store } from '../context/store';

const GET_PROFILE_MANUAL = gql`
  {
    getProfileManual {
      email
      username
    }
  }
`;

const GET_PROFILE_GOOGLE = gql`
  {
    getProfileGoogle {
      name
      email
      picture
    }
  }
`;

const ProfileData: React.FC  = (props:any) => {

  const globalState = useContext(store);
  localStorage.setItem("appState", JSON.stringify(globalState));
  let query =  globalState.authType === "manual" ? GET_PROFILE_MANUAL : GET_PROFILE_GOOGLE;
  const { loading, error, data } = useQuery(query);
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>; 


  return (
    globalState.authType === "manual" ? (    
      <div>
        <p>{data.getProfileManual.email}</p>
      </div>    
    ):(
      <div>
        <p>{data.getProfileGoogle.email}</p>
      </div>  
    )
  )    
}

const Profile: React.FC = (props:any)  => {  
  const globalState = useContext(store);
  if (!globalState.authenticated) {props.history.push("/"); return null;}   
  
  return (      
      <div>  
        <p>Profile</p>  
        {globalState.authenticated ? (<ProfileData  {...props} />):(null) }
      </div>
  );
}

export default Profile;
