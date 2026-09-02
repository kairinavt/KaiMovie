const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return errorResponse(res, 'Vui lòng điền đầy đủ email, mật khẩu và họ tên', 400);
      }
      const data = await authService.register({ email, password, name });
      return successResponse(res, data, 'Đăng ký tài khoản thành công', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return errorResponse(res, 'Vui lòng điền email và mật khẩu', 400);
      }
      const data = await authService.login({ email, password });
      return successResponse(res, data, 'Đăng nhập thành công');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async googleAuth(req, res, next) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return errorResponse(res, 'Thiếu Google ID Token', 400);
      }
      const data = await authService.googleAuth(idToken);
      return successResponse(res, data, 'Đăng nhập Google thành công');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async facebookAuth(req, res, next) {
    try {
      const { accessToken } = req.body;
      if (!accessToken) {
        return errorResponse(res, 'Thiếu Facebook Access Token', 400);
      }
      const data = await authService.facebookAuth(accessToken);
      return successResponse(res, data, 'Đăng nhập Facebook thành công');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async socialLogin(req, res, next) {
    try {
      const { provider, email, name, avatar, providerId } = req.body;
      if (!email || !name) {
        return errorResponse(res, 'Thiếu thông tin tài khoản xã hội', 400);
      }
      const data = await authService.socialLogin({ provider, email, name, avatar, providerId });
      return successResponse(res, data, `Đăng nhập thành công qua ${provider || 'mạng xã hội'}`);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }
}

module.exports = new AuthController();
