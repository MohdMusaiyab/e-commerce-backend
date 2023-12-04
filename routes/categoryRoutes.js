import express from "express";
import { isAdmin,requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController , updateCategoryController,categoryController,singleCategoryController,deleteCategoryController} from "../middlewares/categoryController.js";
// import { isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();
//routes
//for creating category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController,
);
//for updating category
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController)

//Get all the categories
router.get("/get-category",categoryController)

//Single Category Route

router.get("/single-category/:slug",singleCategoryController);

// Now the routes for Deleting the Category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)
export default router;

