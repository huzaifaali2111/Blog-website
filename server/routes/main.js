const express = require("express");
const router = express.Router();
const Post = require('../models/post');


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



// Home getting Data from Database 
// router.get('', async (req, res) => {
//     const locals = {
//         title: "Blogify Website",
//         description: "Blogify is your way to tech Blogs"
//     }
//     try {
//         const posts = await post.find();
//         res.render('index', { locals, posts });
//     }
//     catch (e) {
//         console.log(e)
//     }
// });



// Single Post Page By ID 
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const posts = await Post.findById({ _id: slug });
        const locals = {
            title: posts.title,
            description: "Blogify is your way to tech Blogs"
        }
        res.render('post', { locals, posts });
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



module.exports = router;




// Have insert Some Dumy Blogs in Database Using this Function.


// function insertPostData() {
//     post.insertMany([
//         {
//             title: "Learn How to Make a Website",
//             body: "It's always to Learn How to Make a Website in 2026 the latest year."
//         },
//         {
//             title: "Building APIs with Node.js",
//             body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//         },
//         {
//             title: "Deployment of Node.js applications",
//             body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//         },
//         {
//             title: "Authentication and Authorization in Node.js",
//             body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//         },
//         {
//             title: "Understand how to work with MongoDB and Mongoose",
//             body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//         },
//         {
//             title: "build real-time, event-driven applications in Node.js",
//             body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//         },
//         {
//             title: "Discover how to use Express.js",
//             body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//         },
//         {
//             title: "Asynchronous Programming with Node.js",
//             body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//         },
//         {
//             title: "Learn the basics of Node.js and its architecture",
//             body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//         },
//         {
//             title: "NodeJs Limiting Network Traffic",
//             body: "Learn how to limit netowrk traffic."
//         },
//         {
//             title: "Learn Morgan - HTTP Request logger for NodeJs",
//             body: "Learn Morgan."
//         },
//     ])
// }
// insertPostData();