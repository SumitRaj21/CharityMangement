const bcrypt=require('bcrypt');
const { Op } = require('sequelize');
const User=require('../models/users');
const Organization = require('../models/organisations');



const userSignup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        console.log("Sumit");
        let userExist = await User.findOne({
            where: {
                email: email
            }
        });
        if(!userExist){
            const hashpassword= await bcrypt.hash(password, 10);
            const user = await User.create({ name:name, email:email, password: hashpassword });
            return res.status(201).json({ message: "user Account created successfully" });
        } else{
            return res.status(409).json({ message: 'Email  already exist!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Signup  API',
            error
        })
    }
};
const organizationSignup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        console.log("Sumit");
        let organizationExist = await Organization.findOne({
            where: {
                email: email
            }
        });
        if(!organizationExist){
            const hashpassword= await bcrypt.hash(password, 10);
            const user = await Organization.create({ name:name, email:email, password: hashpassword });
            return res.status(201).json({ message: "Organization Account created successfully" });
        } else{
            return res.status(409).json({ message: 'Email  already exist!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Signup  API',
            error
        })
    }
};


module.exports={
    userSignup,
    organizationSignup,
}