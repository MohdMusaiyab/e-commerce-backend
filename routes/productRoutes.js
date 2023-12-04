import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, getProductController,getSingleProductController ,productPhotoController,deleteProductController,updateProductController,productFilterController,productCountController,productListController,searchProductController,getSimilarProductsController,productCategoryController,braintreeTokenController,braintreePaymentController} from "../controllers/Product.js";
import formidable from "express-formidable";
import braintree from "braintree";

const router=express.Router();
//Now here our routes//
// For creating Product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
//For getting all the Products
router.get('/get-product',getProductController)
//for getting a single product
router.get("/get-product/:slug",getSingleProductController)
//get photot
router.get('/product-photo/:pid',productPhotoController);

//for deeling a product
router.delete('/delete-product/:pid',deleteProductController);
//For Updating the Product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);
//Now adding the route for Filtering the Products
//Can be done at both Frontend and Backend 
router.post('/product-filters',productFilterController)

// New route fro counting Products
router.get('/product-count',productCountController);
//Now for Pagin
router.get('/product-list/:page',productListController);
//Seacrh Route
router.get('/search/:keyword',searchProductController);

//For Getting Similar Products
router.get('/related-products/:pid/:cid',getSimilarProductsController);

//Now for getting the Product by Category
router.get('/product-category/:slug',productCategoryController);

// Rouets for token in Pyement Gateway
router.get('/braintree/token',braintreeTokenController);

//Payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController);
export default router;
