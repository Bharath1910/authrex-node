// eslint-disable-next-line no-unused-vars
const express = require('express');
// eslint-disable-next-line no-unused-vars
const redis = require('../utils/redis');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {redis} redis
 * @return {function}
 */
function wrapper(redis) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return async function rateLimiter(req, res, next) {
    await redis.connect();
    const ip = req.headers.ip;
    const requests = await redis.get(ip);
    if (requests === null) {
      await redis.set(ip, 1, {EX: 10});
      await redis.disconnect();
      next();
      return;
    }

    if (requests > 50) {
      await redis.disconnect();
      res.status(StatusCodes.TOO_MANY_REQUESTS)
          .send({
            message: 'Too many requests, please try again after 10 seconds',
          });
      return;
    }

    await redis.incr(ip);
    await redis.disconnect();
    next();
  };
}

module.exports = {rateLimiter: wrapper};
