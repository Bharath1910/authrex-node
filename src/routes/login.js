// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function main(req, res, prisma) {
  const type = req.query.type;
  if (type === 'user') {
    await user(req, res, prisma, bcrypt, jwt);
    return;
  } else if (type === 'client') {
    await client(req, res, prisma, bcrypt, jwt);
    return;
  } else {
    res.status(StatusCodes.BAD_REQUEST).send({});
    return;
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 * @param {bcrypt} bcrypt
 * @param {jwt} jwt
 */
async function user(req, res, prisma, bcrypt, jwt) {
  const {username, password} = req.body;

  const user = await prisma.users.findUnique({
    where: {username},
  });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send();
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(StatusCodes.UNAUTHORIZED).send();
    return;
  }

  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
  res.status(StatusCodes.OK).send({token});
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 * @param {bcrypt} bcrypt
 * @param {jwt} jwt
 */
async function client(req, res, prisma, bcrypt, jwt) {
  const {username, password} = req.body;

  const user = await prisma.clients.findUnique({
    where: {username, usersId: req.user.id},
  });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send();
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(StatusCodes.UNAUTHORIZED).send();
    return;
  }

  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
  res.status(StatusCodes.OK).send({token});
};

module.exports = {main, user, client};
