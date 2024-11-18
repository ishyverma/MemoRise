import mongoose, { mongo, Schema } from 'mongoose'

const subPageSchema = new Schema({
    subTitle: {
        type: String,
        default: 'New Sub Page'
    },
    subPageOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    },
    content: {
        type: String
    }
}, { timestamps: true })
    
export const Subpage = mongoose.model('Subpage', subPageSchema)