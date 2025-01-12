const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"LaScentlo" <${config.email.user}>`,
        to,
        subject,
        html
      });
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = `
      <h1>Verify Your Email</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;
    return this.sendEmail(email, 'Verify Your Email', html);
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const html = `
      <h1>Reset Your Password</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;
    return this.sendEmail(email, 'Reset Your Password', html);
  }
}

module.exports = new EmailService(); 