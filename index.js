const express=require('express');
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotEnv=require('dotenv');
const cors=require("cors");
const vendorRoutes=require("./routes/vendorRoutes");
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const userRoutes=require('./routes/userRoutes');
const path=require('path');

const app=express();



const PORT=process.env.PORT || 5500;
dotEnv.config();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI)
    .then((req,res)=>{
        console.log(`MongoDB server is successfully connected and running..`);
    }).catch((error)=>{
        console.log(`Error occured during MongoDB server Connection:${error}`);
    });

app.use('/vendor',vendorRoutes);  //This is a middle Ware used for Vendors
app.use('/firm',firmRoutes); // This is a middleWare for firms
app.use('/products',productRoutes); // this is amiddleWare for Products
app.use('/user',userRoutes);
app.use('./uploads',express.static('uploads'));
app.listen(PORT,(req,res)=>{
    console.log(`Server is succesfully connected and runnning at PORT:${PORT}`);
})
