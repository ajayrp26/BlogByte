const Comment = require('../models/comment');
const Blog = require('../models/blog');



module.exports.create = async (req,res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', "Created new comment!");
    res.redirect('/blogs/' + blog._id);
}

module.exports.delete = async (req,res) => {
    const { id, commentid }  = req.params;
    await Blog.findByIdAndUpdate(id, {$pull: {comments:commentid}})
    await Comment.findByIdAndDelete(commentid);
    req.flash('success', "Deleted comment!");
    res.redirect('/blogs/' + id);
}