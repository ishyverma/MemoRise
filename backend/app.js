import express from 'express'
import { connectDB } from './db/db.js'

const app = express()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000)
})
.catch(err => {
    console.log('Backend ERROR: ', err)
})