import React from 'react';
import './App.scss';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import {HashRouter, Route} from "react-router-dom";
import { ApolloProvider } from '@apollo/react-hooks';
import Navbar from "./components/Navbar";
import  ApolloClient from 'apollo-client';
import  {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from "apollo-link-http";
import {ApolloLink} from "apollo-link";
import {StateProvider} from "./context/store";

const httpLink = new HttpLink({ uri: 'http://localhost:4000',credentials: 'include' });

const authLink = new ApolloLink((operation, forward) => {  
  const token = localStorage.getItem('jwt_token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });
  return forward(operation);
});

const defaultOptions:any = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const apolloClient = new ApolloClient({  
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

const App: React.FC = () => {
  
    return (      
        <ApolloProvider client={apolloClient}>  
          <StateProvider>
            <HashRouter>
              <Navbar/>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/discover" component={Discover}></Route>
              <Route exact path="/profile" component={Profile}></Route>
            </HashRouter>      
          </StateProvider> 
        </ApolloProvider>           
    )
}

export default App;
