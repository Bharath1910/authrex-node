const {main, user} = require('../src/routes/signup');
const {StatusCodes} = require('http-status-codes');

describe('signup', () => {
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    req = {query: {}, body: {}};
    res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
    prisma = jest.fn();
  });

  test('should call user function when type is user', async () => {
    req.query.type = 'user';
    const user = jest.fn();
    const client = jest.fn();
    await main(req, res, prisma, user, client);
    expect(user).toHaveBeenCalledWith(req, res, prisma);
  });

  test('should call client function when type is client', async () => {
    req.query.type = 'client';
    const user = jest.fn();
    const client = jest.fn();
    await main(req, res, prisma, user, client);
    expect(client).toHaveBeenCalledWith(req, res, prisma);
  });

  test('should return 404 when type is invalid', async () => {
    req.query.type = 'invalid';
    const user = jest.fn();
    const client = jest.fn();
    await main(req, res, prisma, user, client);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('should return 400 if username or password is missing', async () => {
    req.query.type = 'user';
    req.body.username = null;
    req.body.password = null;

    await user(req, res, prisma);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('return 409 if user already exists', async () => {
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
});
