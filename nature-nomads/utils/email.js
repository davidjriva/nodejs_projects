const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `David Riva <${process.env.EMAIL_FROM}>`;
  }

  configureAndCreateTransport() {
    if (process.env.NODE_ENV === 'production') {
      // TODO: Create a Sendgrid transporter
      return -1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Render HTML based on a Pug template
    const filename = path.join(__dirname, `../views/emails/${template}.pug`);
    const html = pug.renderFile(filename, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // Create a transport
    const transporter = this.configureAndCreateTransport();

    // Send email
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Nature Nomads Family 😄 ⛰️🌲🌊');
  }
};
