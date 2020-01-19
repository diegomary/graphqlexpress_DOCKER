import React, {createContext, useReducer} from 'react';

const initialState = { authenticated:false, authType:null};

const store = createContext({
  ...initialState,
  dispatch: (action: any) => {}
});
const {Provider} = store;


const reducers = (state:any, action:any) => {
  switch(action.type) {
    case 'LOGIN': return {       
      ...state,
      authenticated:true,
      authType:action.payload   
    }      
    case 'LOGOUT': return {       
      ...state,
      authenticated:false,
      authType: null  
    }
    default:
      return state;
  };
}


const StateProvider:React.FC = (props) => { 
  const [state, dispatch] = useReducer(reducers, initialState);
  
  return <Provider value={{ authenticated:state.authenticated, authType: state.authType, dispatch }}>{props.children}</Provider>;
};

export { store, StateProvider }