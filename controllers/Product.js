import slugify from "slugify";
import productModel from "../models/productModel.js ";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import exp from "constants";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";
//Payment Gateway
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({
          error: "Name is Required",
        });

      case !description:
        return res.status(500).send({
          error: "Description is Required",
        });
      case !price:
        return res.status(500).send({
          error: "Price is Required",
        });
      case !quantity:
        return res.status(500).send({
          error: "Quantity is Required",
        });
      case !category:
        return res.status(500).send({
          error: "Category is Required",
        });
      case photo && photo.size > 100000:
        return res.status(500).send({
          error: "Photo is required and must be less than 1MB",
        });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error in Creating Product",
      error,
    });
  }
};

//Controller for getting the Products
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      count_total: product.length,
      message: "All the pproducts are",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: true,
      error,
    });
  }
};

//For getting a single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting a Single Product",
      error,
    });
  }
};
//For getting the Photo of the Product
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting the Photo of the Product",
      error,
    });
  }
};
//For deleting a Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting the Product",
      error,
    });
  }
};
//For Updating the Product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({
          error: "Name is Required",
        });

      case !description:
        return res.status(500).send({
          error: "Description is Required",
        });
      case !price:
        return res.status(500).send({
          error: "Price is Required",
        });
      case !quantity:
        return res.status(500).send({
          error: "Quantity is Required",
        });
      case !category:
        return res.status(500).send({
          error: "Category is Required",
        });
      case photo && photo.size > 100000:
        return res.status(500).send({
          error: "Photo is required and must be less than 1MB",
        });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error in Creating Product",
      error,
    });
  }
};
//For Filtering the Products
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error in Filtering Products",
      error,
    });
  }
};

// for Conunting the total Products
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Product Count",
      error,
    });
  }
};
//For Product Listing
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Page Count",
      error,
    });
  }
};

//Seacrhing Product COntroller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          {
            description: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Searching the Product",
      error,
    });
  }
};
//Related producst controller

export const getSimilarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Similar Products",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Similar Products",
      error,
    });
  }
};
//For getting the Products by Category Controller
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Producs by Category Fetched Sueccessfully",
      products,
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Products by Category",
      error,
    });
  }
};

//For getting the Token in Payment Gateway
export const braintreeTokenController = async (req, res) => {
  try {
    await gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    res.status(500).send({
      success:false,
      error,
    })
  }
};
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((p) => (total += p?.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        }
      },
      function(error,result)
      {
        if(result)
        {
          const order=new orderModel({
            products:cart,
            payment_id:result,
            buyer:req.user._id,
            // buyer:mongoose.Types.ObjectId(req.user._id),

          }).save();
          res.json({ok:true})
        }
        else{
          res.status(500).send(error)
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Error in Payment",
    })
  }
};
