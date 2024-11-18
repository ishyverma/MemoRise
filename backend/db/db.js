import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({path: '../.env'})

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log('Connection Established')
        
    } catch (err) {
        console.error('ERROR: ', err)
    }
}
