const express=require('express');
const userAuthenticate=require('../middleware/auth');
const { userlogin, userProfile, updateProfile, charityProfiles, searchCharities, charityByid, charityPayment, updateTransactionStatus1, updateTransactionStatus0, donationHistory, downloadReceipt } = require('../controllers/users');
const { forgetpassword, resetpassword, updatepassword } = require('../controllers/userResetPassword');

const router=express.Router();

router.post('/user-login',userlogin);
router.get('/user-profile',userAuthenticate.authenticate,userProfile);
router.get('/charities',userAuthenticate.authenticate,charityProfiles);
router.patch('/update-userProfile',userAuthenticate.authenticate,updateProfile);
router.post('/search-charities',userAuthenticate.authenticate,searchCharities);
router.get('/charityByid/:id',userAuthenticate.authenticate,charityByid);
router.post('/payment',userAuthenticate.authenticate,charityPayment);
router.post('/updatetransaction1',updateTransactionStatus1);
router.post('/updatetransaction0',updateTransactionStatus0);
router.get('/donation-history',userAuthenticate.authenticate,donationHistory);
router.get('/receipt-download/:id',userAuthenticate.authenticate,downloadReceipt);
router.post('/forget-password',forgetpassword);
router.get('/reset-password',resetpassword);
router.post('/update-password/:id',updatepassword);

module.exports=router;