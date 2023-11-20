// eslint-disable-next-line no-unused-vars
const express = require('express');
// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function getUser(req, res, prisma) {
  const users = await prisma.clients.findMany({
    where: {
      usersId: req.userId,
    },
    select: {
      id: true,
      username: true,
    },
  });

  res.status(StatusCodes.OK).send(users);
}

module.exports = getUser;
