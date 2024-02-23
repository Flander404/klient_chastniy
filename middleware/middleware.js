


const jwt =require('jsonwebtoken')





const validateJWT = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let result;
    if (authorizationHeader) {
      const token = req.header('authorization').split(' ')[1]; // Bearer <token>
     
      try {
        // Verify makes sure that the token hasn't expired and has been issued by us.
        result = jwt.verify(token, "secretKey");
        // Let's pass back the decoded token to the request object.
        req.user = result;
        // Call next to pass execution to the subsequent middleware.
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification.
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
  

  module.exports={validateJWT}