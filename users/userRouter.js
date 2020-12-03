const express = require('express');
const Users = require('./userDb')

const router = express.Router();

const validateUser = (req, res, next) => {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if(!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
};

const validateUserId = (req, res, next) => {
  Users.getById(req.params)
    .then(user => {
      if(!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        req.user = req.params;
        next();
      }
    })
    .catch(() => {
      res.status(400).json({ message: "invalid user id" });
    });
};

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message});
    });
});

router.post('/:id/posts', validateUserId, validateUser, (req, res) => {
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message});
    });
});

router.get('/', (req, res) => {
  Users.get()
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params, req.body)
    .then(newUser => {
      res.status(200).json(newUser)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
