const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

describe('Auth Controller', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).not.toHaveProperty('password');

      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeTruthy();
    });

    it('should not register user with existing email', async () => {
      await User.create(testUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should send reset password email for existing user', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Password reset email sent');

      const user = await User.findOne({ email: testUser.email });
      expect(user.resetPasswordToken).toBeTruthy();
      expect(user.resetPasswordExpires).toBeInstanceOf(Date);
    });

    it('should handle non-existent email gracefully', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken;
    
    beforeEach(async () => {
      const user = await User.create(testUser);
      resetToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'newpassword123';
      
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Password reset successful');

      const user = await User.findOne({ email: testUser.email });
      const isValidPassword = await user.comparePassword(newPassword);
      expect(isValidPassword).toBe(true);
      expect(user.resetPasswordToken).toBeUndefined();
      expect(user.resetPasswordExpires).toBeUndefined();
    });

    it('should not reset password with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid or expired reset token');
    });
  });
}); 