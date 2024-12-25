const express=require('express');
const { userSignup, organizationSignup } = require('../controllers/signup');

const router=express.Router();

router.post('/user-signup',userSignup);
router.post('/organization-signup',organizationSignup);

module.exports=router;