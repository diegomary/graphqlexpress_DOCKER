const { UserInputError } = require('apollo-server-express');
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {SECRET_KEY} = require("../../config");

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, SECRET_KEY, {expiresIn:"365d"}) //if expiresIn is not set, the token won't expire
}

module.exports = {
    Mutation: {
      async login(_, {loginInput:{email, password}}, context) {
        
        const user = await User.findOne({email});

        if(!user) {
            throw new UserInputError("User doesn't exist");
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            throw new UserInputError("Wrong credentials");
        }
 
        const token = await generateToken(user);

        context.pubSub.publish("NEW_LOGIN", {
            newLogin:{email}
        })
        
        return {
            ...user._doc,
            id:user._id,
            token
        }
        
      },
      async signUp(_, {registerInput: {email, username, password, authType}}) {
          const user = await User.findOne({email});
          if (user) {throw new UserInputError("User already exists")}
          password = await bcrypt.hash(password, 12);
          const newUser = new User({
              email,
              username,
              password,
              createdAt: new Date().toISOString()
          });
          const resUser = await newUser.save();
          
          const token = authType === "manual" ? await generateToken(resUser) : "";

          return {
            ...resUser._doc,
            id:resUser._id,
            token
          }
      }
    },

    Subscription: {
        newLogin: {
            subscribe: (_, __, {pubSub}) => pubSub.asyncIterator("NEW_LOGIN")
        }
    }
};