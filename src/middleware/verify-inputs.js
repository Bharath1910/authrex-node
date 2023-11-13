// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function verifyUserPwd(req, res, next) {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(StatusCodes.BAD_REQUEST).send({});
    return;
  }

  next();
};

module.exports = verifyUserPwd;
