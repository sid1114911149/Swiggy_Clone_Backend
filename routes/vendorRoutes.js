const express=require('express');
const Routes=express.Router();
const vendorController=require("../controllers/vendorController");
Routes.post('/Register',vendorController.add_vendor);
Routes.post('/Login',vendorController.vendorLogin);
Routes.delete('/deleteVendor/:id',vendorController.deleteVendor);
Routes.get('/get-vendors',vendorController.getAllvendors);
Routes.get('/getDetails/:id',vendorController.get_vendor);
module.exports=Routes;