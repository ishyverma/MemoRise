import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be at least 6 characters long'],
        maxlength: [12, 'Password should not exceed 12 characters']
    },
    OAuthId: {
        type: String,
    },
    OAuthProvider: {
        type: String,
        enum: ['Google', 'Github'],
        required: () => {
            return this.OAuthId
        }
    },
    profilePicture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)