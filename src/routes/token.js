// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
// eslint-disable-next-line no-unused-vars
const redis = require('../utils/redis');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {redis} redis
 */
async function main(req, res, redis) {
  const token = crypto.randomBytes(32).toString('hex');

  await redis.connect();
  await redis.set(token, req.userId, {EX: 5 * 60, NX: true});
  await redis.disconnect();

  res.status(StatusCodes.OK).send({token});
}

module.exports = {main};
