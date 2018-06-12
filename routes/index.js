const express = require('express');
const router = express.Router();
const {sendPost} = require('../lib/nested');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const tokens = [];
const users = [];

router.get('/', function(req, res) {
  const user = req.appSession.user;
  if (user) {
    return res.render('index', {title: 'Hello world', user});
  } else {
    return res.render('signin', {title: 'Sign into your account', user});
  }
});

router.post('/send_mail', function(req, res) {
  const user = req.appSession.user;
  if (user) {
    sendPost(user, {
      subject: "hello world app",
      body: "test",
      targets: user.username,
    });
    return res.status(200).send({data: {}, status: "ok"});
  } else {
    return res.status(401).send({data: {}, status: "err"});
  }
});

router.post('/oath/create_token', function(req, res) {
  const token = getToken(16);
  tokens.push(token)
  return res.status(200).send({data: {token}, status:"ok"});
});

router.post('/oath/nested_response', upload.array(), function(req, res) {
  if (tokens.indexOf(req.body.token) > -1) {
    users.push(req.body);
  }
  return res.status(200).send({data: {}, status:"ok"});
});

router.post('/oath/verify_token', function(req, res) {
  const {token} = req.body;
  const user = users.find((user) => user.token === token);
  req.appSession.user = user;
  return res.status(200).send({data: {user}, status:"ok"});
});

module.exports = router;

function getToken(length) {
  if (length % 2 > 0) {
    throw "token length must be even";
  }
  return Math.random().toString(36).substring(2, (length / 2) + 2) + Math.random().toString(36).substring(2, (length / 2) + 2)
}