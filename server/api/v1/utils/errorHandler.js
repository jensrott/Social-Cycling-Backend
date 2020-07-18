// Number, string
// const { NextFunction } = require('express');

// NextFunction type, if we would use typescript

/**
 * @param {number} status 
 * @param {string} msg 
 * @param {Function} next 
 * @return {Object} errorHandler object
 */
const errorHandler = (status = 400, msg, next) => {
  const error = new Error(msg);
  error.status = status;
  return next(error)
};

module.exports = errorHandler;
