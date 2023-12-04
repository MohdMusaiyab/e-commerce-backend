import  express  from "express";
// import {registerController,loginController,testController,forgotPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderUpdateStatusController,getAllUsersController} from "../controllers/authController.js";
import{registerController,loginController,testController,forgotPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderUpdateStatusController,getAllUsersController} from "../controllers/authController.js";                                                                        
import { requireSignIn , isAdmin} from "../middlewares/authMiddleware.js";

//router object
const router=express.Router();
//Routing
//Register Routes || Method POSt
router.post("/register",registerController)
//Login one
router.post("/login",loginController);
//testing Purpose
router.get("/test",requireSignIn, isAdmin,testController)
//Now for Forgetting the Password
router.post("/forgot-password",forgotPasswordController);
//Protected Routes Auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    console.log("working....")
    return res.status(200).send({
        ok:true
    });
});
//Protected Route Admin
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    
        return res.status(200).send({
        ok:true
    });
});
// router.post(
//     "/category/create-category",
//     isAdmin,
//     requireSignIn,
//     createCategoryController,
//   );
//For updtaing the profile
router.put('/profile',requireSignIn,updateProfileController);
//For getting all the users
router.get('/all-users',requireSignIn,isAdmin,getAllUsersController);
//For Orders
router.get('/orders',requireSignIn,getOrdersController);

// Now for getting all the orders for the Admin
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController);

//Now for Updating the Staus of Orders
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderUpdateStatusController);
export default router;