export const handleMongooseError = (err, data, next) => {
  err.status = 400;
  next();
};
