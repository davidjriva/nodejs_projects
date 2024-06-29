const { StatusCodes } = require('http-status-codes');
const { formatError } = require('../utils/formatResponse');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  formatError(res, err);

  next();
};
