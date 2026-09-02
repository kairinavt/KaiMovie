const successResponse = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  const payload = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    payload.pagination = pagination;
  }
  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
