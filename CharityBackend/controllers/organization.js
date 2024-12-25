const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Organization=require('../models/organisations');
const Charity=require('../models/charity');

const accessToken = (id) => {
    return jwt.sign({ userId : id } ,process.env.JWT_SECRET,{expiresIn:'2h'});
};
const organizationLogin=async(req,res)=>{
        try {
            const {email,password}=req.body;
            let organisationExist = await Organization.findOne({ where: { email } });
            if(organisationExist){
                const isPasswordValid=await bcrypt.compare(password, organisationExist.password);
                if(isPasswordValid){
                    res.status(200).json({success: true, message:"Organization Login Successfull",token:accessToken(organisationExist.id)});
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

const organizationProfile=async(req,res)=>{
    try {
      res.status(200).send(req.organization.dataValues);
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error in Login  API',
        error
    })
   }
}
const updateProfile=async(req,res)=>{
    try {
        console.log(req.body);
        const {name,email,phonenumber,address,category}=req.body;
        const [updated] = await Organization.update(
            { name, address, email,phonenumber,category }, 
            { where: { id:req.organization.id } }         
        );
        if (updated) {
            const updatedOrganization = await Organization.findOne({ where: { id:req.organization.id } });
            return res.status(200).json({
                message: 'Organization updated successfully.',
                organization: updatedOrganization,
            });
        }
        return res.status(404).json({ error: 'Organization not found.' });
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: 'An error occurred while updating the organization.' });
    }
}
const createCharity=async(req,res)=>{
        try {
            const organizationDetails=req.organization.dataValues;
            const {project_name,city,category,project_overview,goal,donation_goal}=req.body;
            const newCharity = await Charity.create({
                projectName:project_name,
                city,
                category,
                projectOverview:project_overview,
                goal,
                donationGoal:donation_goal,
                organizationId:organizationDetails.id,
                organizationName:organizationDetails.name
            });
            res.status(201).json({
                message: 'Charity created successfully.',
            });


        } catch (error) {
            console.error('Error inserting charity:', error);
            res.status(500).json({ error: 'An error occurred while creating the charity.' });
        }
}

const charityProfiles=async(req,res)=>{
    try {
        const organizationDetails=req.organization.dataValues;
        const charities = await Charity.findAll({
            where: { organizationId: organizationDetails.id }, 
        });
        // console.log(charities);
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

const editCharity=async(req,res)=>{
        try {
            const id=req.params.id;
            console.log(req.body);
            const {project_name,city,category,project_overview,goal,donation_goal}=req.body;
            const update=Charity.update({
                projectName:project_name,
                city:city,
                category:category,
                projectOverview:project_overview,
                goal:goal,
                donationGoal:donation_goal,
                approvalStatus:'pending',
            },
            {
                where: { id: req.params.id }
            }
        );
        res.status(201).json({ success:true, message:'Charity Details Updated Successful \n Kindly wait for approval'}); 
            
        } catch (error) {
            console.error('Error updating organization:', error);
        res.status(500).json({ error: 'An error occurred while updating the charity.' });
        }
}


module.exports={
    organizationLogin,
    organizationProfile,
    updateProfile,
    createCharity,
    charityProfiles,
    charityByid,
    editCharity
}