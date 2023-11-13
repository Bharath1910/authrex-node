const {main, user, client} = require('../src/routes/signup');
const {StatusCodes} = require('http-status-codes');

describe('signup', () => {
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    req = {query: {}, body: {}, user: {}};
    res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
    prisma = jest.fn();
  });

  test('should return 404 when type is invalid', async () => {
    req.query.type = 'invalid';
    const user = jest.fn();
    const client = jest.fn();
    await main(req, res, prisma, user, client);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('should return 409 if user already exists', async () => {
    req.query.type = 'user';
    req.body.username = 'test';
    req.body.password = 'test';
    const prisma = {users: {
      findUnique: jest.fn(() => 'test'),
    }};
    await user(req, res, prisma);
    expect(prisma.users.findUnique)
        .toHaveBeenCalledWith({where: {username: 'test'}});
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  test('create a new user', async () => {
    req.query.type = 'user';
    req.body.username = 'test';
    req.body.password = 'test';
    const prisma = {users: {
      findUnique: jest.fn(() => null),
      create: jest.fn(() => {
        return {id: 'test'};
      }),
    }};
    const bcrypt = {genSalt: jest.fn(), hash: jest.fn()};

    await user(req, res, prisma, bcrypt);
    expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);

    expect(prisma.users.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });

  test('should return 409 if client already exists', async () => {
    req.query.type = 'client';
    req.user.id = 'test';
    req.body.username = 'test';
    req.body.password = 'test';
    const prisma = {clients: {
      create: jest.fn(() => {
        throw new Error('test');
      }),
    }};
    const bcrypt = {genSalt: jest.fn(), hash: jest.fn()};
    await client(req, res, prisma, bcrypt);
    expect(prisma.clients.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  test('create a new client', async () => {
    req.user.id = 'test';
    req.body.username = 'test';
    req.body.password = 'test';
    const prisma = {clients: {
      create: jest.fn(() => 'test'),
    }};
    const bcrypt = {genSalt: jest.fn(), hash: jest.fn()};
    await client(req, res, prisma, bcrypt);
    expect(prisma.clients.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });
});
