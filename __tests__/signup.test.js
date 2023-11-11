const {main} = require('../src/routes/signup');
const {StatusCodes} = require('http-status-codes');

describe('signup', () => {
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    req = {query: {}};
    res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
    prisma = jest.fn();
  });

  test('should call user function when type is user', async () => {
    req.query.type = 'user';
    const user = jest.fn();
    const customer = jest.fn();
    await main(req, res, prisma, user, customer);
    expect(user).toHaveBeenCalledWith(req, res, prisma);
  });

  test('should call customer function when type is customer', async () => {
    req.query.type = 'customer';
    const user = jest.fn();
    const customer = jest.fn();
    await main(req, res, prisma, user, customer);
    expect(customer).toHaveBeenCalledWith(req, res, prisma);
  });

  test('should return 404 when type is invalid', async () => {
    req.query.type = 'invalid';
    const user = jest.fn();
    const customer = jest.fn();
    await main(req, res, prisma, user, customer);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });
});
