import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

// import dotenv from "dotenv";


// dotenv.config({ path: './env' });



const connectDb = async () => {
    try {
        const connectionsInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n mongodb connected !! DB host ${connectionsInstance.connection.host}`)
    } catch (err) {
        console.log("db connection err", err);
        process.exit(1);
    }
}



export default connectDb;







