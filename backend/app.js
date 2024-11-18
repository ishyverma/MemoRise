import express from 'express'
import { connectDB } from './db/db.js'
import { router } from './routers/user.routes.js'

const app = express()
app.use(express.json())

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000)
})
.catch(err => {
    console.log('Backend ERROR: ', err)
})

app.use('/api/v1/auth', router)