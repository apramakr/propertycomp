const express = require('express');
const nodemailer = require('nodemailer');
const creds = require('../config');
const bodyParser = require('body-parser');

const router = express.Router();

const transport = {
  service: 'gmail',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/sendEmail', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message
  const ip = req.headers['x-forwarded-for'];
  const content = `${message} \n\n [This request originated from IP Address: ${req.ip}]`
  
  const mail = {
    from: name,
    to: email,
    subject: 'Thank you for registering with PropertyCo!',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

module.exports = router;