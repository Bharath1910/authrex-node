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
async function generateToken(req, res, prisma) {
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
async function main(req, res, prisma) {
  const type = req.query.t;

  if (type === 'generate') {
    await generateToken(req, res, prisma);
  }
}

module.exports = {main};
