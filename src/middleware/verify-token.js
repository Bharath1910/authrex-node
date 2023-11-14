const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {jwt} jwt
 * @return {function}
 */
function verifyToken(jwt) {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {function} next
   * @return {function}
   */
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
      return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({message: 'No token provided.'});
    }

    const token = header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send({message: 'Unauthorized!'});
      }
      req.userId = decoded.id;
      next();
    });
  };
}

module.exports = {main: verifyToken(jwt), test: verifyToken};
