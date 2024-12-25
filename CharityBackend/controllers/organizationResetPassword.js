const bcrypt=require('bcrypt');
const  randomstring = require("randomstring");
const Organization=require('../models/organisations')
const OrganizationToken=require('../models/organizationToken');
const sendMail=require('../utils/organizationResetPassword');
const { where } = require('sequelize');

const forgetpassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await Organization.findOne({
            where:{email:email}
        })
        if(!user){
            res.status(200).send({success:false,message:"Invalid Email id"});
        }else{
        const token=randomstring.generate();
        const updateData=await OrganizationToken.create({
            organizationid:user.id,
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
        
        const data = await OrganizationToken.findOne({
            where: {
              token: token, 
            },
          });
        if(data.isactive){
        await OrganizationToken.update(
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
            <form action="/api/users/update-password/${data.organizationid}" method="post">
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
        await Organization.update({password:hashpassword},{where:{id:id}});
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