import express from "express";
import dotenv from  "dotenv";
import morgan from "morgan";
//File ka extension bhi dena patda hai
import connectDb from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import authRoutes from "./routes/authRoute.js"
import productRoutes from "./routes/productRoutes.js"
import contactRoutes from "./routes/contactRoute.js"
import cors from "cors"
import path from "path"
//For configuring env
dotenv.config();
//Databse configuration
//Es Module Fix
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const app=express();
//Middle ware

await connectDb();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
//Using Morgan
//Now here all our routes will be there
app.use(express.static(path.join(__dirname,"./client/build")));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes); 
app.use("/api/v1/products",productRoutes);
app.use('/api/v1/contact',contactRoutes);

app.use('*',function(req,res)
{
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
})
//Name same hona Chahiye env file me and YAHA
const PORT=process.env.PORT || 8080 ;
app.listen(PORT,()=>{
    
})
