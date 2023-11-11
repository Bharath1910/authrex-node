// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function user(req, res, prisma) {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(StatusCodes.BAD_REQUEST).send({});
    return;
  }

  const user = await prisma.users.findUnique({
    where: {username},
  });

  if (user) {
    res.status(StatusCodes.CONFLICT).send({});
    return;
  }

  const newUser = await prisma.users.create({data: {username, password}});
  res.status(StatusCodes.OK).send({id: newUser.id});
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
 */
async function client(req, res, prisma) {
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
 * @param {{user: function}} user
 * @param {{customer: function}} customer
 */
async function main(req, res, prisma, user, customer) {
  const type = req.query.type;
  if (type === 'user') {
    await user(req, res, prisma);
    return;
  } else if (type === 'client') {
    await customer(req, res, prisma);
    return;
  } else {
    res.status(StatusCodes.BAD_REQUEST).send({});
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
 */
async function execute(req, res, prisma) {
  await main(req, res, prisma, user, client);
}

module.exports = {main, user, client, execute};
