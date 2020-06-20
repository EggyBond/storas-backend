var nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'storas.id@gmail.com',
    pass: 'Storas@123'
  }
});

// var mailOptions = {
//   from: 'storas.id@gmail.com',
//   to: 'eggybond18@gmail.com@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'Jancuk!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });