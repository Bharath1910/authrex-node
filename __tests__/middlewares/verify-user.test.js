const {main} = require('../../src/middleware/verify-user');
const {StatusCodes} = require('http-status-codes');

describe('verify existence of user', () => {
  let req = {};
  let res = {};
  let next = jest.fn();
  let mockPrisma = jest.mock('../../src/utils/prisma');

  beforeEach(() => {
    req = {query: {}};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    mockPrisma = jest.mock('../../src/utils/prisma');
  });

  it('should do nothing if type is user', async () => {
    req.query.type = 'user';

    const middleware = main();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if uid is not provided', async () => {
    const middleware = main();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
  });

  it('should return 404 if user is not found', async () => {
    req.query.uid = 'abc';
    mockPrisma.users = {
      findUnique: jest.fn().mockResolvedValue(null),
    };

    const middleware = main(mockPrisma);
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith({});
  });
});
