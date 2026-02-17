const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;
const adminLayout = "../views/layouts/admin";

//Check Login 
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/admin');
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "fuck You ! from catch " })
        
    }
}


// Admin Login Page loading
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Blogify is your way to tech Blogs"
        }
        res.render('admin/index', { locals, layout: adminLayout });
    }
    catch (e) {
        console.log(e)
    }
});

// login authentication 
router.post('/admin', async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    try {
        const userFound = await User.findOne({
            username
        })
        if (!userFound) {
            return res.status(401).json({ message: 'user name issue' });
        }
        const isPasswordValid = await bcrypt.compare(password, userFound.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'pasword' });
        }
        const token = jwt.sign({ userId: userFound._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');



    }
    catch (e) {
        console.log(e)
    }
});


// Admin Dashboard

router.get('/dashboard', authMiddleware, async (req, res) => {
    const locals = {
        title: "dashboard",
        description: "Blogify is your way to tech Blogs"
    }
    try {
        const data = await Post.find();
        res.render('admin/dashboard', { locals, data, layout: adminLayout });
    } catch (e) {

    }
});

// Admin-create New post page
router.get('/add-post', authMiddleware, async (req, res) => {
    const locals = {
        title: "Add Post",
        description: "Blogify is your way to tech Blogs"
    }
    try {
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
    } catch (e) {

    }
});


// Admin-edit the post 
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect('/dashboard');
    } catch (e) {
        console.error("Update failed:", e);
        res.status(500).send("Server Error");
    }
});


// Admin will get the-edit-post page
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    const locals = {
        title: "Edit Post",
        description: "Blogify is your way to tech Blogs"
    }
    try {
        const data = await Post.findOne({ _id: req.params.id });
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (e) {
    }
});

//andmin-delete the post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (e) {
        console.error("Delete failed:", e);
        res.status(500).send("Server Error");
    };
});

// Admin-save New post
router.post('/add-post', authMiddleware, async (req, res) => {
    try {

        try {
            const newpost = new Post({
                title: req.body.title,
                body: req.body.body,
            });
            await Post.create(newpost);
            res.redirect('/dashboard');
        } catch (error) {

        }

    } catch (e) {

    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin');
});




// Registration 
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         try {
//             const users = await User.create({ username, password: hashedPassword });
//             res.status(201).json({ message: 'user Created' });
//         }
//         catch (e) {
//             if (e.code === 11000) {
//                 res.status(409).json({ message: 'user already existed' });
//             }
//             res.status(500).json({ message: 'something on our end, But not you ! ' })
//         }
//     }
//     catch (e) {
//         console.log(e)
//     }
// });




module.exports = router;