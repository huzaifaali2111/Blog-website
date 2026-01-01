const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
// Routes
router.get('', (req, res) => {
    const locals = {
        title: "Blogify Website",
        description: "Blogify is your way to tech Blogs"
    }
    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});



module.exports = router;