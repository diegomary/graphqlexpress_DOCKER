const express = require('express');
const { ApolloServer, gql,PubSub } = require('apollo-server-express');
const mongoose = require("mongoose");
const {MONGODBCONNECTION} = require("./config.js");
//const resolvers = require("./graphql/resolvers/index");
//const typeDefs = require("./graphql/typedefs/index");
const pubSub = new PubSub();
const {model, Schema} = require("mongoose");
 
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;
 
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
 
//const server = new ApolloServer({ typeDefs, resolvers });

const server = new ApolloServer({ typeDefs, resolvers, context: ({req}) => ({req, pubSub}) });
 
const app = express();
app.use(express.static('react'));

const allowCrossDomain =  (req, res, next) => {
  // let allowedOrigins = process.env.NODE_ENV === "production" ? ['https://diegoburlando.github.io']  : ['http://localhost:3000','https://diegoburlando.github.io','http://localhost:4200'];  
  // let origin = req.headers.origin;
  // if(allowedOrigins.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin); 
  res.setHeader('Access-Control-Allow-Origin', "*"); 
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, csrf-token, Custom-Auth-Step1, Custom-Auth-Step2, Custom-Auth-Step3, Custom-Auth-Step4');
  if ('OPTIONS' == req.method) {res.sendStatus(200); }
  else { next(); }
};

app.use(allowCrossDomain);
app.get('/someroute', (req,res) => { res.json({ status : "base route"});});
server.applyMiddleware({ app }); 

mongoose.connect(MONGODBCONNECTION, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> {
  console.log("MongoDB connected at Mongo Atlas development mode");
return  app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

})
.then(async connectionInfo => {
//   var MyModel = mongoose.model('Test', new Schema({ name: String }));
//   const newUser = new MyModel({
//    name:"Diego Aldo Burlando"
// });
// const resUser = await newUser.save();
// console.log(resUser);
mongoose.connection.db.listCollections().toArray((err, names) => {console.log("collections in DB:",names.map((col) =>{return col.name}));});
});
