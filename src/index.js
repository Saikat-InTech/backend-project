import dotenv from "dotenv";

import connectDb from "./db/index.js"

dotenv.config({path:'./env'});



 connectDb();





















// import express from 'express'; 

// const app= express();
//   (async ()=>{
// try{
//  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//  app.on("err",(err)=>{
//     console.log("err",err);
//     throw err;
//  })
//  app.listen(process.env.PORT,()=>{
//     console.log(`app is listen at port no ${process.env.PORT}`)
//  })
// } catch(error){
//     console.log("Error",error);
//     throw error;
// }
//   })()