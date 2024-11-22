import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.COULDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        fs.unlinkSync(localFilePath)
        console.log('File Has Been Uploaded On Cloudinary')
        return response
    } catch (err) {
        fs.unlinkSync(localFilePath)
        console.log('ERROR: ', err)
    }
}
