const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uploadFile = require('../middleware/upload-file');
const processFile = require('../middleware/process-file');
const checkToken = require('../middleware/check-token');
const hashSecret = require('../hashSecret');

const router = express.Router();

// Authenticate user
router.post('/login', (req, res) => {
  const User = mongoose.model('user');

  // When username or password is missing
  if(!req.body.username && !req.body.password) return res.status(400).end();

  User
    .findOne({ username: req.body.username})
    .select('+password -_id')
    .exec((err, user) => {

      // Something fails in database
      if(err) {
        console.log(err);
        return res.status(500).end();
      }

      // User wasn't found
      if(!user) return res.status(401).end();

      // Compare given password with stored password
      user.comparePassword(req.body.password, (err, isMatch) => {

        // Something fails in database
        if(err) {
          console.log(err);
          return res.status(500).end();
        }

        // If passwords match
        if(isMatch) {
          // Select the user again with all fields populated (no password field)
          User
            .findOne({ username: req.body.username})
            .populate({
              path: 'favorites',
              populate: {
                path: 'user',
              },
            })
            .exec((err, user) => {
              // Something fails in database
              if(err) {
                console.log(err);
                return res.status(500).end();
              }

              // Generate access token
              const { _id } = user;
              const token = jwt.sign({ _id }, hashSecret);

              // Send access token and user object to client
              return res.status(200).json({ user, token });
            });
        } else {
          return res.status(422).end();
        }
      });
    });
});

// Create new user
router.post('/', uploadFile, processFile, (req, res) => {
  const User = mongoose.model('user');

  // Create new user
  const newUser = new User(req.body);

  // Save user to DB
  newUser.save((err, user) => {
    // Delete password property of user object
    user.password = undefined;

    // Username already exists
    if(err && err.code === 11000) {
      return res.status(409).end();
    }

    // Something else failed in the DB
    if(err && err.code !== 11000) {
      console.log(err);
      return res.status(500).end();
    }

    const { _id } = user;
    const token = jwt.sign({ _id }, hashSecret);

    return res.status(201).json({ token, user });
  });
});

// Update existing user
router.put('/', checkToken, uploadFile, processFile, (req, res) => {
  const User = mongoose.model('user');

  // Find user in database
  User.findById(req.userID)
    .exec((err, user) => {
      // Something fails in database
      if(err) {
        console.log(err);
        return res.status(500).end();
      }

      // Add body data to found user
      Object.assign(user, req.body);

      user.save((err, user) => {
        // Delete password property of user object
        console.log(user);
        user.password = undefined;

        // Username already exists
        if(err && err.code === 11000) {
          return res.status(409).end();
        }

        // Something else failed in the DB
        if(err && err.code !== 11000) {
          console.log(err);
          return res.status(500).end();
        }

        return res.status(200).json({ user });
      });
    });
});

module.exports = router;
