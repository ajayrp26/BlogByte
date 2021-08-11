const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Blog = require('../models/blog');
const { isLoggedIn, isAuthor, validateBlog, validateComment, isCommentAuthor } = require('../middleware');
const { blogSchema } = require('../schemas.js');
const blogs = require('../controllers/blogs');

router.get('/new', isLoggedIn, blogs.renderNew)

router.get('/:id', catchAsync(blogs.show))



router.get('/', catchAsync(async (req,res) => {
    const blogs = await Blog.find({}).populate('author');
    res.render('blogs', { blogs , title : "Blogbyte" })
}))


router.post('/', isLoggedIn, validateBlog, catchAsync(blogs.createNew))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(blogs.renderEdit))

router.put('/:id', isLoggedIn, isAuthor, validateBlog, catchAsync(blogs.update))

router.delete('/:id',  isLoggedIn, isAuthor, catchAsync(blogs.delete))

module.exports = router;
