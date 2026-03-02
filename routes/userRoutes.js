const express=require('express');
const Routes=express.Router();
const userController=require('../controllers/UserController');
Routes.post('/Register',userController.Register);
Routes.post('/Login',userController.Login);

module.exports=Routes;