const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey=process.env.JWT_SECRET;
const Razorpay=require('razorpay');
const User=require('../models/users');
const Charity=require('../models/charity');
const Donation=require('../models/donations');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const paymentMail=require('../utils/paymentConfirmation')

const accessToken = (id) => {
    return jwt.sign({ userId : id } ,process.env.JWT_SECRET,{expiresIn:'2h'});
};
const userlogin=async(req,res)=>{
        try {
            const {email,password}=req.body;
            let userExist = await User.findOne({ where: { email } });
            if(userExist){
                const isPasswordValid=await bcrypt.compare(password, userExist.password);
                if(isPasswordValid){
                    res.status(200).json({success: true, message:"User Login Successfull",token:accessToken(userExist.id)});
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

const userProfile=async(req,res)=>{
   try {
        console.log(req.user.dataValues);
      res.status(200).send(req.user.dataValues);
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
            // console.log(req.body);
            const {name,email,phone,gender,address,profession}=req.body;
            // console.log(req.user.id);
          const update=  await User.update({
                    name:name,
                    email:email,
                    phonenumber:phone,
                    gender:gender,
                    address:address,
                    profession:profession   
                },
                {
                    where: { id: req.user.id }
                }
          )
           res.json({ success:true, message:'User Profile Update Successful'}); 
        } catch (error) {
            // console.log(error.message)
            res.status(500).send({
                success:false,
                message:'Error in Login  API',
                error
            });
        
        }
}
const charityProfiles=async(req,res)=>{
    try {
        // const organizationDetails=req.organization.dataValues;
        const charities = await Charity.findAll({
            where: { approvalStatus: 'approved' }, 
        });
        return res.status(200).send(charities);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while getting the charity.' });
    }
}

const searchCharities=async(req,res)=>{
        try {
            const {projectName,city,category}=req.body;
            const charities = await Charity.findAll({
                where: {
                  [Op.or]: [
                    { projectName: { [Op.like]: `%${projectName}%` } },
                    { city: { [Op.like]: `%${city}%` } },
                    { category: { [Op.like]: `%${category}%` } },
                  ]
                }
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

const charityPayment=async(req,res)=>{
    try {
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        // console.log(req.body.amount);
        // console.log(req.body.charityId);
        const amount=req.body.amount*100;
        // console.log(req.user.id);
        rzp.orders.create({amount, currency: "INR"},async (err, order) => {
            if(err) {
                res.status(403).json({ message: 'Sometghing went wrong', error: err});

            }
            const charity=await Charity.findOne({
                where:{id:req.body.charityId},
            });
            const newDonation = await Donation.create({
                userId:req.user.id,
                organizationName:charity.organizationName,
                projectName:charity.projectName,
                donationAmount:req.body.amount,
                orderId:order.id,
            });

            if(!newDonation){
                return res.status(404).send({
                    success:false,
                    message:"Error in insert Querry"
                })
            } 
            return res.status(201).json({ order, key_id : rzp.key_id});
        })
        
    } catch (error) {
        
    }
}

const updateTransactionStatus1=async(req,res)=>{
    try {
        // console.log(req.body);
        const { payment_id, order_id} = req.body;
        const userOrderStatus= await Donation.update({
            paymentId:payment_id,
            orderStatus:'SUCCESSFUL',
        },
        { where: {orderId :order_id } } );

        const donation=await Donation.findOne({
            where:{paymentId:payment_id}
        });
        const user=await User.findOne({
            where:{id:donation.userId}
        })
        await paymentMail(user.email,user.name,donation.donationAmount,donation.projectName);
        return  res.status(202).send({ success:true, message:'Transaction Successful'});    
    } catch (error) {
        console.log(error);
        res.status(403).json({ errpr: error, message: 'Sometghing went wrong' });
    }

}
const updateTransactionStatus0=async(req,res)=>{
    try {
        // console.log(req.body);
        const { order_id} = req.body;
        const userOrderStatus= await Donation.update({
            orderStatus:'FAILED',
        },
        { where: {orderId :order_id } } );
       
        return  res.status(202).send({ success:true, message:'Transaction Failed'});    
    } catch (error) {
        console.log(error);
        res.status(403).json({ errpr: error, message: 'Sometghing went wrong' });
    }

}
const donationHistory=async(req,res)=>{
        try {
             const id=req.user.id;
             const donations=await Donation.findAll({
                where:{userId:id}
             });
            //  console.log(donations);
             return res.status(200).send(donations);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while getting the donations.' });
        }
}

const downloadReceipt = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Donation ID is required." });
      }
      const donation = await Donation.findOne({ where: { id } });
  
      if (!donation) {
        return res.status(404).json({ error: "Donation not found." });
      }
      const doc = new PDFDocument();
      const fileName = `Receipt-${id}-${Date.now()}.pdf`;
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);
      doc.fontSize(18).text('Donation Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Project Name: ${donation.projectName}`);
      doc.text(`Organization Name: ${donation.organizationName}`);
      doc.text(`Amount: Rs. ${donation.donationAmount}`);
      doc.text(`Date: ${new Date(donation.updatedAt).toISOString().split('T')[0]}`);
      doc.moveDown();
      doc.text('Thank you for your donation!', { align: 'center' });
      doc.end();
    } catch (error) {
      console.error("Error generating receipt:", error);
      res.status(500).json({ error: "Failed to generate receipt. Please try again." });
    }
  };
  

module.exports={
    userlogin,
    userProfile,
    updateProfile,
    charityProfiles,
    searchCharities,
    charityByid,
    charityPayment,
    updateTransactionStatus1,
    updateTransactionStatus0,
    donationHistory,
    downloadReceipt
}