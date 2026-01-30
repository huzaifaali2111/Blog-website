const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    body: { type: String, required: true },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema)