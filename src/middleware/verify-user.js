// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
// eslint-disable-next-line no-unused-vars
const redis = require('../utils/redis');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {prisma} prisma
 * @param {redis} redis
 * @return {function}
 */
function main(prisma, redis) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return async function verifyUser(req, res, next) {
    if (req.query.type === 'user') {
      next();
      return;
    }

    const {token} = req.query;
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).send({});
      return;
    }

    const userId = await redis.get(token);
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED)
          .send({message: 'token expired, please login again'});
      return;
    }

    const user = await prisma.users.findUnique({
      where: {id: userId},
    });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).send({});
      return;
    }

    req.user = user;
    next();
  };
}

module.exports = {main};
