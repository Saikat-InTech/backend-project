import express from "express"
import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "12kb" }));
app.use(express.urlencoded({

    
    extended: true,
    limit: "12kb",
}));
app.use(express.static("public"));

app.use(cookieParser());




// app.on("error", () => {
//     console.log("error", error);
//     throw error
// })

//routes
import  router  from "./routes/user.routes.js"




// routes declaration
app.use("/api/v1/users", router);

// console.log(app);
export default app;