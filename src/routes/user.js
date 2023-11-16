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
  console.log(req.query.redirect);
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

  parsedOptions.filter((option) => validOptions.includes(option));
  if (parsedOptions.length === 0) {
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
  console.log(req.query.options);
  if (!req.query.options) {
    return;
  }

  try {
    parseOptions(req.query.options);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message,
    });
  }

  await prisma.users.update({
    where: {id: req.userId},
    data: {options: req.query.options},
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

  await updateRedirect(req, res, prisma);
  await updateOptions(req, res, prisma);
  res.status(StatusCodes.NO_CONTENT).json({});
}

module.exports = {user, updateRedirect, updateOptions};
