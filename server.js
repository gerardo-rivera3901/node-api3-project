const express = require('express');
const postsRoutes = require('./posts/postRouter');
const usersRoutes = require('./users/userRouter');

const server = express();

const logger = (req, res, next) => {
  console.log(`${req.method} request at "${req.url}" on ${Date()}`);
  next();
};

server.use(express.json());
server.use('/api/posts', postsRoutes);
server.use('/api/users', usersRoutes);
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
