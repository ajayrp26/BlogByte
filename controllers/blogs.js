const Blog = require('../models/blog');

module.exports.renderNew = (req,res) => {
    res.render('newBlog', { title : "New Blog"})
}


module.exports.show = async (req,res) => {
    const { id } = req.params;
    const blog = await (await Blog.findById(id).populate({
        path: 'comments', 
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if (!blog) {
        req.flash('error', 'Cannot find that blog!');
        return res.redirect('/blogs');
    }
    res.render('blog', { blog , title : "View Blog" })
}

module.exports.createNew = async (req,res) => {
    const newBlog = new Blog(req.body);
    newBlog.author = req.user._id;
    await newBlog.save();
    req.flash('success', 'Successfully created a new blog!');
    res.redirect('/blogs')
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id)
    if (!blog) {
        req.flash('error', 'Cannot find that blog!');
        return res.redirect('/blogs');
    }
    res.render('edit', { blog , title : "Edit Blog"});
}

module.exports.update = async (req,res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully updated blog!');
    res.redirect('/blogs/' + blog._id);
}

module.exports.delete = async (req,res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted blog!');
    res.redirect('/blogs')
}