// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {prisma} prisma
 * @return {function}
 */
function main(prisma) {
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

    const {uid} = req.query;
    if (!uid) {
      res.status(StatusCodes.BAD_REQUEST).send({});
      return;
    }

    const user = await prisma.users.findUnique({
      where: {id: uid},
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
