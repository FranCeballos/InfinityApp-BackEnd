exports.next500error = (next, err) => {
  const error = new Error(err);
  error.serverStatusCode = 500;
  return next(error);
};
