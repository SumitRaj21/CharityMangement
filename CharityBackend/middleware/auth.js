const jwt = require('jsonwebtoken');
const User=require('../models/users');
const authenticate = async(req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(token);
        const decode = jwt.verify(token, process.env.JWT_SECRET );
        const user= await User.findByPk(decode.userId);
         if(user){
            req.user = user;
            next(); 
        }else{

            response.status(401).send({message:"Unauthorized"});
        }
        // next();
      } catch(error) {
      
        if (error.name === 'TokenExpiredError') {
            
            res.status(401).json({ message: 'Time out please sign in again' });
        } else {
            console.log("I am here");
            res.status(500).json({ message: 'Something went wrong  - please sign again' });
        }
      }

}

module.exports = {
    authenticate
}