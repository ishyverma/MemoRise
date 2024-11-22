import { Router } from 'express'
import { User } from '../models/users.model.js'
import bcrypt from 'bcrypt'
import { upload } from '../middlewares/multer.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authenticator } from '../middlewares/authenticate.js'

export const router = Router()
dotenv.config('../.env')

router.post('/register', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
    const { username, password, email, profilePicture } = req.body
    const hashedPassword = await bcrypt.hash(password, 5)
    console.log(hashedPassword)

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
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

    const uploadPicture = await uploadOnCloudinary(imageLocalPath)

    try {
        const createUser = await User.create({ username: username.toLowerCase(), password: hashedPassword, email, profilePicture: uploadPicture.url })
        
        res.json({
            Message: 'User Created Successfully'
        })
    } catch (err) {
        res.status(404).json({
            ErrorMessage: 'Error Adding User In Register' 
        })
    }
})

router.post('/login', async (req, res) => {
    const { username, password, email } = req.body
    console.log(password)
        try {
            const user = await User.findOne({
                $or: [{ username }, { password }]
            })
            console.log(user)
            const hashedPassword = await bcrypt.compare(password, user.password)

            if (hashedPassword) {
                const accessToken = jwt.sign({ username, email, id: user._id }, process.env.ACCESS_TOKEN_SECRET)
                const refreshToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET)

                const options = {
                    httpOnly: true,
                    secure: true
                }

                console.log('accessToken', accessToken)
                console.log('refreshToken', refreshToken)

                user.accessToken = accessToken
                user.refreshToken = refreshToken

                res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    accessToken,
                    refreshToken
                })
                console.log('updated user: ', user)
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
})

router.post('/logout', authenticator, async (req, res) => {
    const findedUser = req.user
    try {
        const user = await User.findByIdAndUpdate(findedUser._id, {
            $set: {
                refreshToken: undefined
            }
        }, {
            new: true
        })

        const options = {
            httpOnly: true,
            secure: true
        }

        console.log('new user: ', user)
        res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            Message: "User Logged Out"
        })
    } catch (err) {
        res.status(404).json({
            ErrorMessage: err
        })
    }
})