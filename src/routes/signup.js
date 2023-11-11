// eslint-disable-next-line no-unused-vars
const prisma = require('../utils/prisma');
// eslint-disable-next-line no-unused-vars
const express = require('express');
const {StatusCodes} = require('http-status-codes');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
 */
async function user(req, res, prisma) {
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {prisma.PrismaClient} prisma
 */
async function customer(req, res, prisma) {
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
  } else if (type === 'customer') {
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
  await main(req, res, prisma, user, customer);
}

module.exports = {main, user, customer, execute};
