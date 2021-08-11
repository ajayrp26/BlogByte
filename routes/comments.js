const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Comment = require('../models/comment');
const Blog = require('../models/blog'); 
const { isLoggedIn, isAuthor, validateBlog, validateComment, isCommentAuthor } = require('../middleware');
const { commentSchema } = require('../schemas.js');
const comments = require('../controllers/comments');


router.post('/', isLoggedIn, validateComment, catchAsync(comments.create))

router.delete('/:commentid', isLoggedIn, isCommentAuthor, catchAsync(comments.delete))

module.exports = router;
