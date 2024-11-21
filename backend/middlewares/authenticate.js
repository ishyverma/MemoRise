import jwt from 'jsonwebtoken'

export const authenticator = (req, res, next) => {
    const { token } = req.headers
    try {
        const verifyData = jwt.verify(token, process.env.JWT_SECRET)
        if (verifyData) {
            const email = verifyData.email
            const username = verifyData.username
            req.email = email
            req.username = username
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