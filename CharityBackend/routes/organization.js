const express=require('express');
const { organizationLogin, organizationProfile, updateProfile, createCharity, charityProfiles, charityByid, editCharity } = require('../controllers/organization');
const organizationAuthenticate=require('../middleware/organizationAuth');
const { forgetpassword, resetpassword, updatepassword } = require('../controllers/organizationResetPassword');

const router=express.Router();

router.post('/organization-login',organizationLogin);
router.get('/organization-profile',organizationAuthenticate.authenticate,organizationProfile);
router.patch('/update-organizationProfile',organizationAuthenticate.authenticate,updateProfile);
router.post('/create-charity',organizationAuthenticate.authenticate,createCharity);
router.get('/charities',organizationAuthenticate.authenticate,charityProfiles);
router.get('/charityByid/:id',organizationAuthenticate.authenticate,charityByid);
router.post('/edit-charity/:id',organizationAuthenticate.authenticate,editCharity);

router.post('/forget-password',forgetpassword);
router.get('/reset-password',resetpassword);
router.post('/update-password/:id',updatepassword);


module.exports=router;