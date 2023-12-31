// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 * @param {bcrypt} bcrypt
 */
async function user(req, res, prisma, bcrypt) {
  const {username, password} = req.body;

  const user = await prisma.users.findUnique({
    where: {username},
  });

  if (user) {
    res.status(StatusCodes.CONFLICT).send({});
    return;
  }

  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);

  await prisma.users.create({
    data: {username, password: hashedPass},
  });

  res.status(StatusCodes.NO_CONTENT).send();
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 * @param {bcrypt} bcrypt
 */
async function client(req, res, prisma, bcrypt) {
  const {username, password} = req.body;

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  try {
    await prisma.clients.create({
      data: {
        username,
        password: hash,
        users: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.CONFLICT).send({});
    return;
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 * @param {function} user
 * @param {function} customer
 */
async function main(req, res, prisma) {
  const type = req.query.type;
  if (type === 'user') {
    await user(req, res, prisma, bcrypt);
    return;
  } else if (type === 'client') {
    await client(req, res, prisma, bcrypt);
    return;
  } else {
    res.status(StatusCodes.BAD_REQUEST).send({});
  }
};


module.exports = {main, user, client};
