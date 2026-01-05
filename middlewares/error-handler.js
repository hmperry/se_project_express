const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle different types of errors
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // Default to 500 for unknown errors
  return res.status(500).send({ message: "An error occurred on the server" });
};

module.exports = errorHandler;
