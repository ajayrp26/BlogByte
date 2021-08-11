const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const methodOverride = require('method-override')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { blogSchema, commentSchema } = require('./schemas.js');
const flash = require('connect-flash');
const { isLoggedIn, isAuthor, validateUser, validateBlog, validateComment, isCommentAuthor } = require('./middleware');
const Comment = require('./models/comment');

const blogsRoutes = require('./routes/blogs');
const commentsRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const mongoSanitize = require('express-mongo-sanitize');



mongoose.connect('mongodb://localhost:27017/Blogbyte', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.set('view engine','ejs')
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', ejsMate)

app.use(mongoSanitize());




const sessionConfig = {
    secret: 'secret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoutes);
app.use('/blogs', blogsRoutes);
app.use('/blogs/:id/comments', commentsRoutes);


app.get('/', catchAsync(async (req,res) => {
    const blogs = await Blog.find({}).populate('author');
    res.render('home', { blogs , title : "Blogbyte" })
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    console.log(err)
    res.status(statusCode).render('error', { err,title : "Error"})
})

app.listen(3000, () => {
    console.log("LISTENING!")
})