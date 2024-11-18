import mongoose, { Schema } from 'mongoose'

const pageSchema = new Schema({
    title: {
        type: String,
        default: 'New Page',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdPages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subpage'
    }],
    tags: [{
        type: String,
    }]
}, { timestamps: true })

export const Page = mongoose.model('Page', pageSchema)
