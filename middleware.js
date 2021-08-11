const { blogSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');
const Blog = require('./models/blog');
const Comment = require('./models/comment');



module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blog/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentid } = req.params;
    const comment = await Comment.findById(commentid);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blog/${id}`);
    }
    next();
}
