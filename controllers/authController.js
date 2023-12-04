import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //Now validation
    if (!name) {
      res.send({ message: "Name is required" });
    }
    if (!email) {
      res.send({ message: "Email is required" });
    }
    if (!password) {
      res.send({ message: "Password is required" });
    }
    if (!phone) {
      res.send({ message: "Phone Number is required" });
    }
    if (!address) {
      res.send({ message: "Address is required" });
    }
    if (!answer) {
      res.send({ message: "Security Answer missing" });
    }
    //Now checking the existing User

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered Kindly Login",
      });
    }
    //Now for new User
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};
// export default registerController;
//Now making for Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Details",
      });
    }
    //Now checking the User in DB
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not Registered",
      });
    }
    //Now checking of the password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //Now token Generation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7D",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
//Now for getting the User
export const getAllUsersController=async(req,res)=>{
  try{
    const users=await userModel.find({});
    res.status(200).send({
      success:true,
      message:"All Users",
      users
    })
  }
  catch(error)
  {
    res.status(500).send({
      success: false,
      message: "Error in Getting the Users",
      error,
    });
  }
}
//Forgot Passowrd Controller

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is Required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is Required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is Required",
      });
    }
    //Now checking email and asnwer
    const user = await userModel.findOne({ email, answer });
    //Now validation
    if (!user) {
      res.status(400).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hash = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hash });
    res.status(200).send({
      success: true,
      message: "Password Reset Sucessfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};
//For testing purpose
export const testController = (req, res) => {
  res.send("Protected Routes");
};

//Updating the Profile COntroller
export const updateProfileController = async (req, res) => {
  try {
    const { email, name, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);

    //Checking the Password
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required and must be 3 character long",
      });
    }

    //hashing the password
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address,
        phone: phone || user.phone,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Updating The Profile",
      error,
    });
  }
};

//For getting the Orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req?.user?._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting the Orders",
      error,
    });
  }
};
//For getting all the Orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting the Orders",
      error,
    });
  }
};
//Updating the Status of the Orders
export const orderUpdateStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status,
      },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Updating the Status",
      error,
    });
  }
};
