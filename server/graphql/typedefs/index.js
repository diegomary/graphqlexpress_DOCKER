const {gql} = require("apollo-server");

module.exports = gql`

    type AuthPayload {
        iss:String
        sub:String
        name:String
        family_name:String
        locale:String
        exp:String
        azp:String
        aud:String
        email:String
        email_verified:String
        at_hash:String
        picture:String
        given_name:String
        iat:String
        jti:String
    }

    type ChatMessage {
        messageId: Int! 
        from: String!
        message: String!
      }

    type User {
        id:ID!
        email:String!
        username:String!
        token:String!  
        createdAt:String!     
    }

    type LoginSubscription {
        email:String!
    }

    input LoginInput {
        email:String! 
        password:String!
    }

    input RegisterInput {
        email:String!
        username:String!
        password:String!
        authType:String!
    }

    type Query {
        getProfileGoogle: AuthPayload
        getProfileManual: User
        chats: [ChatMessage]
    }

    type Mutation {
        login(loginInput:LoginInput) : User!
        signUp(registerInput:RegisterInput) : User!
        sendMessage(from: String!, message: String!): ChatMessage
    }

    type Subscription {
        newLogin: LoginSubscription!
        messageSent: ChatMessage
    }

   


`