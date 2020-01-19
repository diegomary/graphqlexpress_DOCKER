const googleAuthenticationResolvers = require("./googleauthentication");
const usersResolvers = require("./users");
const chatResolvers = require("./chat");

module.exports = {
    Query: {
        ...googleAuthenticationResolvers.Query,
        ...chatResolvers.Query

    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...chatResolvers.Mutation
    },

    Subscription: {
        ...usersResolvers.Subscription,
        ...chatResolvers.Subscription
    }
}