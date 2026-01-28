const express = require("express");
const router = express.Router();
const Post = require('../models/post');

const adminLayout = "../views/layouts/admin";


// Admin Login Page 

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Blogify is your way to tech Blogs"
        }
        
        res.render('admin/index', { locals,  layout: adminLayout });
    }
    catch (e) {
        console.log(e)
    }
});


module.exports = router;