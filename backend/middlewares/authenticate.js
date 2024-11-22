import jwt from 'jsonwebtoken'
import { User } from '../models/users.model.js'

export const authenticator = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers["authorization"].replace("Bearer ", "")
    try {
        const verifyData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(verifyData)
        if (verifyData) {
            const user = await User.findById(verifyData.id)
            req.user = user
            next()
        } else {
            req.status(404).json({
                ErrorMessage: 'User Not Signed In'
            })
        }
    } catch (err) {
        res.status(404).json({
            ErrorMessage: 'User Not Signed In'
        })
    }
}