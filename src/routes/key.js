// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function generateApiKey(req, res, prisma) {
  const token = crypto.randomBytes(16).toString('hex');
  await prisma.users.update({
    where: {id: req.userId},
    data: {apiKey: token},
  });

  res.status(StatusCodes.OK).send({token});
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function getApiKey(req, res, prisma) {
  const user = await prisma.users.findUnique({
    where: {id: req.userId},
    select: {apiKey: true},
  });

  res.status(StatusCodes.OK).send({token: user.apiKey});
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
 */
async function main(req, res, prisma) {
  const type = req.query.t;

  if (type === 'generate') {
    await generateApiKey(req, res, prisma);
    return;
  }

  if (type === 'get') {
    await getApiKey(req, res, prisma);
    return;
  }

  res.status(StatusCodes.BAD_REQUEST).send({message: 'Invalid type'});
}

module.exports = {main, generateApiKey, getApiKey};
