const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'geheim';
//note:
//the way JWT is passed from front end to back end is through an auth header
//the value starts with the word "Bearer" and then, after a space, is the actual token

module.exports = async (cnx, next) => {
    //if no token is present, 403 error is thrown
    //console.log(cnx.headers.authorization)
    try {
      const token = cnx.headers.authorization.split(' ')[1]; //read note above
    } catch (err) {
      cnx.throw(403, 'No token.');
    }
    //if (token == "undefined") cnx.throw(403, 'No token.');
    try { //verifies the token
        const token = cnx.headers.authorization.split(' ')[1]; //read note above
        cnx.request.jwtPayload = jwt.verify(token, secret);
        //jwt.verify returns tokens payload (and sub (username of user))
        //it is set to ctx.request.jwtPayload
        //this can be used down the middleware chain
        //so for fucntions that need to use the token
        //or even to validate user is logged in
        //put this file within the index.js use for it
      } catch (err) {
        cnx.throw(err.status || 403, err.text);
      }
    await next();
  };
