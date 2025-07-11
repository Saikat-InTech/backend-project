// import dotenv from "dotenv";

import connectDb from "./db/index.js"
import app from "./app.js"
// dotenv.config({ path: './env' });

connectDb().then(
    () => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`server is running ${process.env.PORT}`)
        })
    }
).catch((err) => console.log("mongo not connect", err))







