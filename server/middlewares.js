const encryption = require('./encryption');
const database = require('./db_api');

const authMiddleware = function() {
    return (req, res, next) => {

        if (req.originalUrl === '/api/auth' || req.originalUrl === '/api/signup') {
          next();
          return;
        }

        const token = req.headers.authorization.slice(7);
        const decryptedToken = encryption.getTokenParts(token);
        
        const db = require('./credentials.json');
        const user = database.getUser(decryptedToken.uid);

        // Make sure the user is logged-in
        if(!user){
          res.status(401).send('User not logged in');
        }

        if(decryptedToken.expiration < Date.now()){
          res.status(440).send("The clients session has expired and must log in again");
        }

        next();
        
    }
}
module.exports = {
  authMiddleware: authMiddleware(),
}