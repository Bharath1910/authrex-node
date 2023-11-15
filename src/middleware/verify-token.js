const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
// eslint-disable-next-line no-unused-vars
const express = require('express');

/**
 * @param {jwt} jwt
 * @return {function}
 */
function verifyToken(jwt) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
      console.log(res.status().send());
      res.status(StatusCodes.UNAUTHORIZED)
          .send({message: 'No token provided.'});
      return;
    }

    const token = header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(StatusCodes.UNAUTHORIZED)
            .send({message: 'Unauthorized.'});
        return;
      }
      req.userId = decoded.id;
      next();
    });
  };
}

module.exports = {main: verifyToken(jwt), test: verifyToken};
