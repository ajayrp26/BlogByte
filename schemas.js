const Joi = require('joi');

module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        blogtitle: Joi.string().required(),
        blogtext: Joi.string().required()
    }).required()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
    }).required()
});