const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com");
const { AuthenticationError } = require('apollo-server');
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");

module.exports =  async (context)  => {

    const authHeader = context.req.headers.authorization;
    
    if(authHeader) {
        const token = authHeader.split("Bearer ")[1]; 
       
        if(token) {         
          
          let manualToken = token.replace("Manual_", "");
          let googleToken = token.replace("Google_", "");          
          if (manualToken.length < token.length) {
            try{
              const user = jwt.verify(manualToken, SECRET_KEY);
              user.token = manualToken;
              return user;
            }
            catch(err) { throw new AuthenticationError("Invalid/expired manual token");}            
          }
          if (googleToken.length < token.length) {
            try {
              const ticket = await client.verifyIdToken({ idToken: googleToken });
              const payload = ticket.getPayload();              
              return payload;
            }
            catch(err) { throw new AuthenticationError("Invalid/expired google token"); } 
          }
        }
        throw new Error("Authentication token must be \"Bearer [token]\"");     
    
    } throw new Error("Authentication header must be provided");

    
}



