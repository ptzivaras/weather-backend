function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.stack || err.message);

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error'
  });
}

module.exports = errorHandler;
