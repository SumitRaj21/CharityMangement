const express=require('express');
const { adminLogin, charityProfiles, charityByid, charityStatus } = require('../controllers/admin');


const router=express.Router();

router.post('/admin-login',adminLogin);
router.get('/charities',charityProfiles);
router.get('/charityByid/:id',charityByid);
router.post('/charitystatus',charityStatus);

module.exports=router;