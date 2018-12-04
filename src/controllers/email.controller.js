import config from '../../config';

export const sendEmail = ({ trip, user }) => {
  const nodemailer = require('nodemailer');

  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message); //eslint-disable-line no-console

      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...'); //eslint-disable-line no-console

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: config.email.user, // generated ethereal user
        pass: config.email.password // generated ethereal password
      }
    });

    // Message object
    let message = {
      from: user.email,
      to: [trip.participants],
      subject: 'Confirm your Flock account',
      text: 'Hi dear Flocker',
      html: `<p><b>Hello Dear Flocker!</b></br></br>Thank you for joining the most popular trip organiser of the market!</br>You have been invited to join the folowwing trip <b>${
        trip.name
      }</b> by ${
        user.email
      }.</br>Please click on the following link to confirm your account: <a href>http://localhost:3000/</a></br></br>Thank you for joining Flock. </br>Your Flock Team!</p>`
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message); //eslint-disable-line no-console

        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId); //eslint-disable-line no-console

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); //eslint-disable-line no-console
    });
  });
};
