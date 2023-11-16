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
async function updateRedirect(req, res, prisma) {
  if (!req.query.redirect) {
    return;
  }

  await prisma.users.update({
    where: {id: req.userId},
    data: {redirect: req.query.redirect},
  });

  return;
}

/**
 * @param {string} options
 * @return {Array<string>}
 * @throws {Error}
*/
function parseOptions(options) {
  const parsedOptions = options.split(',');
  const validOptions = ['username', 'pgp'];

  const returnOptions = parsedOptions.filter((option) => {
    return validOptions.includes(option);
  });

  if (returnOptions.length === 0) {
    throw new Error('Invalid options');
  }

  return parsedOptions;
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma} prisma
*/
async function updateOptions(req, res, prisma) {
  if (!req.query.options) {
    return;
  }

  const methods = parseOptions(req.query.options);
  await prisma.users.update({
    where: {id: req.userId},
    data: {methods},
  });

  return;
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
*/
async function user(req, res, prisma) {
  const {redirect, options} = req.query;

  if (!redirect && !options) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing query parameters',
    });
  };

  try {
    await updateRedirect(req, res, prisma);
    await updateOptions(req, res, prisma);
    res.status(StatusCodes.NO_CONTENT).json({});
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message,
    });
  }
}

module.exports = {user, updateRedirect, updateOptions};
