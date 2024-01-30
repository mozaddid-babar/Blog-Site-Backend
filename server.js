const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8080;

// middleware
app.use(bodyParser.json());
app.use(cors());

// Reading data
const jsonData = fs.readFileSync('data.json', 'utf8');
const { blogs: initialBlogs, comments: initialComments } = JSON.parse(jsonData);

// Initialize blogs and comments arrays
let blogs = initialBlogs;
let comments = initialComments;

app.get('/', (req, res) => {
    res.send('Blog Server is Running');
});

// Create Blog
app.post('/blogs', (req, res) => {
    const { userId, id, title, body } = req.body;
    const newBlog = { userId, id, title, body };
    blogs.push(newBlog);
    res.status(201).json(newBlog);
});

// Update Blog
app.put('/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const { userId, title, body } = req.body;
    const updatedBlogIndex = blogs.findIndex(blog => blog.id === blogId);

    if (updatedBlogIndex !== -1) {
        blogs[updatedBlogIndex] = {
            ...blogs[updatedBlogIndex],
            userId: userId || blogs[updatedBlogIndex].userId,
            title: title || blogs[updatedBlogIndex].title,
            body: body || blogs[updatedBlogIndex].body,
        };
        res.json(blogs[updatedBlogIndex]);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// Delete Blog
app.delete('/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const deletedBlogIndex = blogs.findIndex(blog => blog.id === blogId);

    if (deletedBlogIndex !== -1) {
        const deletedBlog = blogs[deletedBlogIndex];
        blogs.splice(deletedBlogIndex, 1);
        res.json(deletedBlog);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// Get all Blogs
app.get('/blogs', (req, res) => {
    res.json(blogs);
});

// Create Comment
app.post('/comments', (req, res) => {
    const { blogId, id, name, email, body } = req.body;
    const newComment = { blogId, id, name, email, body };
    comments.push(newComment);
    res.status(201).json(newComment);
});

// Get all Comments for a specific Blog
app.get('/comments/:blogId', (req, res) => {
    const blogId = parseInt(req.params.blogId);
    const blogComments = comments.filter(comment => comment.blogId === blogId);
    res.json(blogComments);
});

// Get Favorite Blogs for a User
app.get('/users/:userId/favorites', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);

    if (user) {
        const favoriteBlogs = blogs.filter(blog => user.favorites.includes(blog.id));
        res.json(favoriteBlogs);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Toggle Blog as Favorite for a User
app.put('/users/:userId/favorites/:blogId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const blogId = parseInt(req.params.blogId);
    const user = users.find(user => user.id === userId);

    if (user) {
        const index = user.favorites.indexOf(blogId);

        if (index === -1) {
            // Blog is not in favorites, add it
            user.favorites.push(blogId);
        } else {
            // Blog is in favorites, remove it
            user.favorites.splice(index, 1);
        }

        res.json({ favorites: user.favorites });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
});
