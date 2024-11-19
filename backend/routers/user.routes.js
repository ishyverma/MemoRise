import { Router } from 'express'
import { User } from '../models/users.model.js'
import bcrypt, { hash } from 'bcrypt'
import { upload } from '../middlewares/multer.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const router = Router()
dotenv.config('../.env')

router.post('/register', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
    const { username, password, email, profilePicture } = req.body
    const hashedPassword = await bcrypt.hash(password, 5)

    if ([username, password, email, profilePicture].some(field => field?.trim() === '')) {
        res.status(404).json({
            ErrorMessage: 'All Fields Are Required'
        })
    }

    const existedUser = await User.findOne({
        username,
        email
    })

    if (existedUser) {
        res.status(404).json({
            ErrorMessage: 'User Already Exists'
        })
    }

    const imageLocalPath = req.files?.profilePicture[0]?.path

    if (!imageLocalPath) {
        res.status(404).json({
            ErrorMessage: 'Profile Picture Is Required'
        })
    }

    const picture = await uploadOnCloudinary(imageLocalPath)
    
    if (!picture) {
        res.status(404).json({
            ErrorMessage: 'There Was An Error Uploading The Picture'
        })
    }

    try {
        const createUser = await User.create({ username: username.toLowerCase(), password: hashedPassword, email, profilePicture: picture.url })
        res.json({
            Message: 'User Created Successfully'
        })
    } catch (err) {
        res.status(404).json({
            ErrorMessage: 'Error Adding User In The Database/Register' 
        })
    }
})

router.post('/login', async (req, res) => {
    const { username, password, email } = req.body
    if ([username, password, email].some((field) => field.trim() === '' || undefined)) {
        res.status(404).json({
            ErrorMessage: 'All Fields Are Required'
        })
    } else {
        try {
            const user = await User.findOne({
                username,
                email
            })
            const hashedPassword = await bcrypt.compare(password, user.password)

            if (hashedPassword) {
                const token = jwt.sign({ username, email }, process.env.JWT_SECRET)
                console.log(token)
                res.json({
                    Message: "User Logged In Successfully"
                })
            } else {
                res.status(404).json({
                    ErrorMessage: "User Not Registered"
                })
            }
        } catch (err) {
            res.status(404).json({
                ErrorMessage: `User Not Exists: Register, ${err}`
            })
        }   
    }
})

