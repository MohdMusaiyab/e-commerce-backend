import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is Required",
      });
    }
    const existingCategory=await categoryModel.findOne({name});
    if(existingCategory)
    {
        return res.status(200).send({
            success:true,
            message:"Category already existed",
        })
    }
    
        const category=await  new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"New category created",
            category,
        })
    
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

//Update Category Cotroller
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            message:"Category Update Sucessfully",
            success:true,
            category,
        })
    }
    catch(error)
    {
        res.status(500).send({
            message:"Error while updating category",
            success:false,
            error,  
        })
    }

}
export const categoryController=async(req,res)=>{   
    try{
            const category=await categoryModel.find({});
            res.status(200).send({
                success:true,
                message:"All Categories List",
                category,
            })
    }
    catch(error)
    {
        res.status(500).send({
            message:"Error in Fetching Categories",
            success:false,
            error,
        })
    }
}
//For Single Category
export const singleCategoryController=async(req,res)=>{
    try{
        
        const category=await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get Single Category Success",
            category,
        })
    }   
    catch(error)
    {
        res.status(500).send({
            success:false,
            message:"Error while getting the Single Category",
            error,
        })
    }

}
//Delete Controller
export const deleteCategoryController=async(req,res)=>{
    try{    
        const {id}=req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfuly",
        })
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:"Error while Deleting the Category",
            error,
        })
    }
}