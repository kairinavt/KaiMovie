const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');
const env = require('../../config/env');
const User = require('../users/user.model');

// In-memory fallback users cache if MongoDB is offline in dev
const memoryUsers = [];

class AuthService {
  async register({ email, password, name }) {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('Email này đã được đăng ký');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        email: email.toLowerCase(),
        passwordHash,
        name,
        provider: 'local'
      });

      const token = this.generateToken(user._id, user.email, user.name);
      return { user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }, token };
    } else {
      const existing = memoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        throw new Error('Email này đã được đăng ký');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        _id: 'user_' + Date.now(),
        email: email.toLowerCase(),
        passwordHash,
        name,
        avatar: '',
        provider: 'local'
      };
      memoryUsers.push(user);
      const token = this.generateToken(user._id, user.email, user.name);
      return { user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }, token };
    }
  }

  async login({ email, password }) {
    const isDbConnected = mongoose.connection.readyState === 1;

    let user;
    if (isDbConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = memoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const userId = user._id || user.id;
    const token = this.generateToken(userId, user.email, user.name);
    return {
      user: { id: userId, email: user.email, name: user.name, avatar: user.avatar || '' },
      token
    };
  }

  async googleAuth(idToken) {
    let email, name, avatar, providerId;

    try {
      // Validate Google ID Token via Google's tokeninfo API
      const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const gUser = res.data;
      if (!gUser.email) {
        throw new Error('Xác thực Google thất bại');
      }
      email = gUser.email;
      name = gUser.name || gUser.email.split('@')[0];
      avatar = gUser.picture || '';
      providerId = gUser.sub || '';
    } catch (err) {
      // If tokeninfo API fails or invalid token, throw descriptive error
      throw new Error('Token Google không hợp lệ hoặc đã hết hạn');
    }

    return this.socialLogin({ provider: 'google', email, name, avatar, providerId });
  }

  async facebookAuth(accessToken) {
    let email, name, avatar, providerId;

    try {
      const res = await axios.get(`https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
      const fbUser = res.data;
      email = fbUser.email || `${fbUser.id}@facebook.com`;
      name = fbUser.name || 'Facebook User';
      avatar = fbUser.picture?.data?.url || '';
      providerId = fbUser.id || '';
    } catch (err) {
      throw new Error('Token Facebook không hợp lệ hoặc đã hết hạn');
    }

    return this.socialLogin({ provider: 'facebook', email, name, avatar, providerId });
  }

  async socialLogin({ provider, email, name, avatar, providerId }) {
    const isDbConnected = mongoose.connection.readyState === 1;
    const userEmail = email.toLowerCase();

    if (isDbConnected) {
      let user = await User.findOne({ email: userEmail });
      if (!user) {
        user = await User.create({
          email: userEmail,
          name,
          avatar: avatar || '',
          provider: provider || 'google',
          providerId: providerId || ''
        });
      }
      const token = this.generateToken(user._id, user.email, user.name);
      return {
        user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar },
        token
      };
    } else {
      let user = memoryUsers.find(u => u.email === userEmail);
      if (!user) {
        user = {
          _id: 'user_social_' + Date.now(),
          email: userEmail,
          name,
          avatar: avatar || '',
          provider: provider || 'google',
          providerId: providerId || ''
        };
        memoryUsers.push(user);
      }
      const token = this.generateToken(user._id, user.email, user.name);
      return {
        user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar },
        token
      };
    }
  }

  async getMe(userId) {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) throw new Error('Không tìm thấy người dùng');
      return { id: user._id, email: user.email, name: user.name, avatar: user.avatar };
    } else {
      const user = memoryUsers.find(u => u._id === userId);
      if (!user) throw new Error('Không tìm thấy người dùng');
      return { id: user._id, email: user.email, name: user.name, avatar: user.avatar };
    }
  }

  generateToken(userId, email, name) {
    return jwt.sign(
      { id: userId, email, name },
      env.jwtSecret || 'kaimovie_secret_key_123456',
      { expiresIn: env.jwtExpiresIn || '7d' }
    );
  }
}

module.exports = new AuthService();
