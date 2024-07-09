const { getReasonPhrase } = require('http-status-codes');

exports.formatResponse = (res, statusCode, data) => {
  const response = {
    message: getReasonPhrase(statusCode),
  };

  if (data) response.data = data;

  res.status(statusCode).json(response);
};