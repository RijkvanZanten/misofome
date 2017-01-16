const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uploadFile = require('../middleware/upload-file');
const processFile = require('../middleware/process-file');
const checkToken = require('../middleware/check-token');

const app = require('../../../../index');

const messages = require('../messages');

const router = express.Router();

router.post('/', (req, res) => {
  const User = mongoose.model('user');

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: messages.AUTH_USER_NOT_FOUND,
      });
    } else {
      // Test a matching password
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(user, app.get('secretString'));

          res.json({
            success: true,
            message: messages.AUTH_SUCCESS,
            token,
            user,
          });
        } else {
          res.json({
            success: false,
            message: messages.AUTH_WRONG_PASSWORD,
          });
        }
      });
    }
  });
});

router.post('/register', uploadFile, processFile, (req, res) => {
  const User = mongoose.model('user');

  const newUser = new User(req.body);

  newUser.save((err, record, numAffected) => {
    console.log(err);
    if (err) {
      res.json({ success: false, message: err });
    } else {
      const token = jwt.sign(newUser, app.get('secretString'));

      res.json({
        success: true,
        message: 'User created',
        token,
        user: record,
      });
    }
  });
});

router.put('/update', checkToken, uploadFile, processFile, (req, res) => {
  const User = mongoose.model('user');

  User.findById(req.user._id, (err, doc) => {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    }

    Object.assign(doc, req.body);

    doc.save((err, updatedDoc) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        });
      } else {
        res.send(updatedDoc);
      }
    });
  });
});

module.exports = router;
