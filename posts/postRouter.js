const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

const validatePost = (req, res, next) => {
  if(!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
};

const validatePostId = (req, res, next) => {
  Posts.getById(req.params)
    .then(post => {
      if(!post) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        req.id = req.params;
        next();
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};


router.get('/', (req, res) => {
  Posts.get()
    .then(allPosts => {
      res.status(200).json(allPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params)
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  Posts.update(req.params, req.body)
    .then(updated => {
      res.status(201).json(updated);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
