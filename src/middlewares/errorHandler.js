function errorHandler(err, req, res, next) {
  console.error('Erro capturado:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;

  const response = {
    error: true,
    message: err.statusCode ? err.message : 'Erro interno do servidor'
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;