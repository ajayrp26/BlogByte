const mongoose = require('mongoose');
const Comment = require('./comment');


const blogSchema = new mongoose.Schema({
    blogtext: {
        type: String,
        required: true,
    },
    blogtitle: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})


blogSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

const Blogs = mongoose.model('Blog', blogSchema);

module.exports = Blogs;
