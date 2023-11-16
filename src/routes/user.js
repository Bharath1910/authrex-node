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
