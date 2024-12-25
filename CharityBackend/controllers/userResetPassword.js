const bcrypt=require('bcrypt');
const  randomstring = require("randomstring");
const User=require('../models/users');
const UserToken=require('../models/userToken');

const sendMail=require('../utils/userResetPasswordMail');
const { where } = require('sequelize');

const forgetpassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({
            where:{email:email}
        })
        if(!user){
            res.status(200).send({success:false,message:"Invalid Email id"});
        }else{
        const token=randomstring.generate();
        const updateData=await UserToken.create({
            userid:user.id,
            token:token,
        });
        await sendMail(email,token);
        res.status(202).send({success:true, message:'reset mail sent'});
        }  
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const resetpassword=async(req,res)=>{
       try {
        const {token}=req.query;
        
        const data = await UserToken.findOne({
            where: {
              token: token, 
            },
          });
        if(data.isactive){
        await UserToken.update(
            {
                isactive:false,
            },
            {
            where:{token:token}
        })
        res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <form action="/api/users/update-password/${data.userid}" method="post">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`
        )
        }else{
            res.status(410).send(`<html><h1>Link  expired </h1></html>`)
        }
       } catch (error) {
       
        res.status(400).send(error.message);
       }
}

const updatepassword=async(req,res)=>{
    try {
        const id=req.params.id;
        const {newpassword}=req.body;
        const hashpassword= await bcrypt.hash(newpassword, 10);
        await User.update({password:hashpassword},{where:{id:id}});
        res.status(202).send(`<html><h1>Password changed successfully</h1></html>`);
    } catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports={
    forgetpassword,
    resetpassword,
    updatepassword
}