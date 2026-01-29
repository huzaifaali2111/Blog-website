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
        res.render('admin/index', { layout: adminLayout, message: "Please login first" });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId
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
    const { username, password } = req.body;

    try {
        const userFound = await User.findOne({
            username
        })
        if (!userFound) {
            return res.status(401).json({ message: 'Something is invalid' });
        }
        const isPasswordValid = await bcrypt.compare(password, userFound.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Something is invalid' });
        }
        const token = jwt.sign({ userId: userFound._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');



    }
    catch (e) {
        console.log(e)
    }
});




router.get('/dashboard', authMiddleware, async (req, res) => {
    res.render('admin/dashboard');
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