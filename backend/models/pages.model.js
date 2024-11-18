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
    subPagesForTodo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subpage'
    }],
    // Tags like project, work and personal
    tags: [{ 
        type: String,
    }],
    lastEdited: {
        type: Date
    }
}, { timestamps: true })

export const Page = mongoose.model('Page', pageSchema)
