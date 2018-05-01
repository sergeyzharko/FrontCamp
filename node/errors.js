function logErrors (err, req, res, next) {
    console.error(err.stack);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next(err);
  };
  
  function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(err.status || 404);
      res.send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  };
  
  function errorHandler (err, req, res, next) {
    res.status(err.status || 404);
    res.render('error', { title: 'Error', message: err.message });
  };

  function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
  
    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";
  }
  

  exports.logErrors = logErrors;
  exports.clientErrorHandler = clientErrorHandler;
  exports.errorHandler = errorHandler;
  exports.HttpError = HttpError;