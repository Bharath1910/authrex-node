const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');

/**
 * @param {prisma} prisma
 * @param {Boolean} verifyKey
 * @return {function}
 */
function verifyToken(prisma, verifyKey) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return async (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
      console.log(res.status().send());
      res.status(StatusCodes.UNAUTHORIZED)
          .send({message: 'No token provided.'});
      return;
    }

    const token = header.split(' ')[1];
    if (verifyKey) {
      user = await prisma.users.findUnique({
        where: {
          id: req.userId,
        },
        select: {
          apiKey: true,
        },
      });

      if (user.apiKey === token) {
        next();
        return;
      }
    }

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

module.exports = {main: verifyToken};
