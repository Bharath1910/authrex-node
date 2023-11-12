const {main, user} = require('../src/routes/login');
const {StatusCodes} = require('http-status-codes');

describe('login', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {query: {}, body: {}};
    res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
  });

  test('should return 400 when type is invalid', async () => {
    req.query.type = 'invalid';
    const prisma = jest.fn();
    await main(req, res, prisma);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('should return 400 if username or password is missing', async () => {
    req.body.username = null;
    req.body.password = null;
    const prisma = jest.fn();
    await user(req, res, prisma);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('should return 404 if user does not exist', async () => {
    req.body.username = 'test';
    req.body.password = 'test';
    const prisma = {users: {findUnique: jest.fn(() => null)}};

    await user(req, res, prisma);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  test('should return 401 if password does not match', async () => {
    req.body.username = 'test';
    req.body.password = 'test';
    const bcrypt = {compare: jest.fn(() => false)};
    const prisma = {users: {
      findUnique: jest.fn(() => {
        return {id: 1, password: 'test'};
      }),
    }};

    await user(req, res, prisma, bcrypt);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  test('should send token if validation was successful', async () => {
    req.body.username = 'test';
    req.body.password = 'test';
    const bcrypt = {compare: jest.fn(() => true)};
    const prisma = {users: {
      findUnique: jest.fn(() => {
        return {id: 1, password: 'test'};
      }),
    }};

    await user(req, res, prisma, bcrypt);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
