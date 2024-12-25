const jwt = require('jsonwebtoken');
const Organization=require('../models/organisations');
const authenticate = async(req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, process.env.JWT_SECRET );
        const organization= await Organization.findByPk(decode.userId);
        // console.log("i am here");
         if(organization){
            req.organization = organization;
            next();
        }else{
            response.status(401).send({message:"Unauthorized"});
        }
        
      } catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Time out please sign in again' });
        } else {
            res.status(500).json({ message: 'Something went wrong  - please sign again' });
        }
      }
      
}

module.exports = {
    authenticate
}