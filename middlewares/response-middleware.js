export const responseMiddleware = (req, res, next) => {
  res.success = (message = "", data = null, status = 200) => {
    res.status(status).json({
      success: true,
      status,
      data,
      message,
    });
  };

  res.fail = (message = "", status = 400, data = null) => {
    res.status(status).json({
      success: false,
      status,
      data,
      message,
    });
  };

  next();
};
