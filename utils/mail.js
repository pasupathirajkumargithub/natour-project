// Import the nodemailer library
const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.mail;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Pasupathi ${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //1) render html based on a pug template

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2)Define email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //3) create transport and send e-mail

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "welcome to natours project...!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token ( valid for only 10 min"
    );
  }
};
