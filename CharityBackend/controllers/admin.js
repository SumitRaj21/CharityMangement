const Admin=require('../models/admin');
const Charity=require('../models/charity');

const adminLogin=async(req,res)=>{
    try {
        const {username,password}=req.body;
        let userExist = await Admin.findOne({ where: { username } });
        if(userExist){
            
            if(userExist.password==password){
                res.status(200).json({success: true, message:"User Login Successfull"});
            }else{
                return res.status(401).json({success: false, message:"Invalid Password"});
            }
        }else{
            return res.status(409).json({ message: 'Account does not exist!' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Login  API',
            error
        })
    }

}

const charityProfiles=async(req,res)=>{
    try {
        // const organizationDetails=req.organization.dataValues;
        const charities = await Charity.findAll({
            where: { approvalStatus: 'pending' }, 
        });
        return res.status(200).send(charities);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while getting the charity.' });
    }
}

const charityByid=async(req,res)=>{
    try {
        const id = req.params.id;
        const charity=await Charity.findOne({
            where:{id:id},
        });
        return res.status(200).send(charity.dataValues);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while getting the charity.' });
    }
}
const charityStatus=async(req,res)=>{
            try {
                const {approvalStatus,charityId}=req.body;
                await Charity.update({
                    approvalStatus:approvalStatus
                },{where:{id:charityId}});
                return res.json({message: "Charity status is updated"});

            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'An error occurred while updating the charity.' });
            }
}
module.exports={
    adminLogin,
    charityProfiles,
    charityByid,
    charityStatus
}