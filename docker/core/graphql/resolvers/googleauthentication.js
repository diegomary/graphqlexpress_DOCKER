const { AuthenticationError } = require('apollo-server-express');
const checkAuth = require("../../utils/checkauth");

module.exports = {
    Query: {
      getProfileGoogle(_, __, context) {

        const profile = checkAuth(context);
        return profile;
        
      },
      getProfileManual(_, __, context) {

        const profile = checkAuth(context);
        return profile;
        
      }
    },
};