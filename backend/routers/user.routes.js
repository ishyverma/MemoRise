import { Router } from 'express'
import { User } from '../models/users.model.js'
import bcrypt from 'bcrypt'
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
        throw new Error('All Fields Are Required')
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new Error('User Already Exists')
    }

    const imageLocalPath = req.files?.profilePicture[0]?.path

    if (!imageLocalPath) {
        throw new Error('Profile Picture Is Required')
    }

    const picture = await uploadOnCloudinary(imageLocalPath)
    
    if (!picture) {
        throw new Error('Profile Picture Is Required')
    }

    try {
        const createUser = await User.create({ username: username.toLowerCase(), password: hashedPassword, email, profilePicture: picture.url })
        console.log('User registered')
        res.json({
            Message: 'User Created Successfully'
        })
    } catch (err) {
        console.log('ERROR Adding User In The Database/Register: ', err)
        throw new Error('User Not Added In The Database')
    }

    console.log('Files', req.files)
    console.log('Body', req.body)
})

router.post('/login', async (req, res) => {
    const { username, password, email } = req.body
    if ([username, password, email].some(field => field?.trim() === '')) {
        throw new Error('All Fields Are Required')
    }
    const hashedPassword = await bcrypt.compare(password)
    if (hashedPassword) {
        res.status(404).json({
            ErrorMessage: 'Password Is Incorrect'
        })
    }
    try {
        const user = await User.findOne({
            $or: [{ username }, { password }, { email }]
        })
        if (user) {
            const token = jwt.sign({ username, email }, process.env.JWT_SECRET)
            localStorage.setItem('token', token)
            console.log(token)
        } else {
            throw new Error('User Not Registered')
        }
    } catch (err) {
        throw new Error('Error Fetching Data From Database')
    }
})