const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comments');


// Passing Current Path in Veriable
router.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});


// Home getting Data from Database And Also working Pagination 
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Blogify website",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});

// Single Post Page By ID 
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        
        const posts = await Post.findById(slug); 
        
        if (!posts) {
            return res.status(404).send("Post not found");
        }
        const comments = await Comment.find({ post: slug }).sort({ createdAt: -1 });

        const locals = {
            title: posts.title,
            description: "Blogify is your way to tech Blogs"
        }
        res.render('post', { locals, posts, comments });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


// Get by Searching 
router.post('/search', async (req, res) => {
    const locals = {
        title: 'search',
        description: "Blogify is your way to tech Blogs"
    }
    try {
        let searchTerm = req.body.searchTerm.trim();
        const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '');
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searcNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searcNoSpecialChar, 'i') } }
            ]
        });
        res.render("search", {
            data,
            locals,
            searchTerm
        });

    }
    catch (e) {
        console.log(e)
    }
});



router.get('/about', (req, res) => {
    res.render('about', { status: req.query.status });
});

router.get('/contact', (req, res) => {
    res.render('contact');
});




//Comment Route to save in database
router.post('/add-comment', async (req, res) => {
    try {
        const { comment, postId } = req.body; 
        const newComment = new Comment({
            body: comment,
            post: postId  
        });

        await newComment.save();
        res.redirect(`/post/${postId}`); 
    } catch (err) {
        console.log(err);
        res.status(500).send('Error saving comment');
    }
});


// Exporting Router to get comment on our page 
router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.render('comments', { comments });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;




