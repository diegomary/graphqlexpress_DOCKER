const express = require('express');
const { ApolloServer, gql,PubSub } = require('apollo-server-express');
const mongoose = require("mongoose");
const {MONGODBCONNECTION} = require("./config.js");
const resolvers = require("./graphql/resolvers/index");
const typeDefs = require("./graphql/typedefs/index");
const pubSub = new PubSub();
const path = require('path');
const server = new ApolloServer({ typeDefs, resolvers, context: ({req}) => ({req, pubSub}) });
 
const app = express();
//app.use(express.static('react'));
app.use('/', express.static(path.join(__dirname, 'react')))

const allowCrossDomain =  (req, res, next) => {
  let allowedOrigins = process.env.NODE_ENV === "production" ? []  : ['http://localhost:3000'];  
  let origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, csrf-token, Custom-Auth-Step1, Custom-Auth-Step2, Custom-Auth-Step3, Custom-Auth-Step4');
  if ('OPTIONS' == req.method) {res.sendStatus(200); }
  else { next(); }
};

app.use(allowCrossDomain);
app.get('/someroute', (req,res) => { res.json({ status : "base route"});});
server.applyMiddleware({ app, cors: {origin: "http://localhost:3000", credentials: true }}); 

mongoose.connect(MONGODBCONNECTION, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=> {
  console.log("MongoDB connected at Mongo Atlas development mode");
  return  app.listen({ port: 8080 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

})
.then(async connectionInfo => { mongoose.connection.db.listCollections().toArray((err, names) => {console.log("collections in DB:",names.map((col) =>{return col.name}));});});
