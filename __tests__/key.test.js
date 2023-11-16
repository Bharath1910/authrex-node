const {generateApiKey, main, getApiKey} = require('../src/routes/key');
const crypto = require('crypto');
const {PrismaClient} = require('@prisma/client');
const {StatusCodes} = require('http-status-codes');

const prisma = new PrismaClient();

jest.mock('crypto');
jest.mock('@prisma/client');
describe('API Key test cases', () => {
  let req = {query: {}};
  const res = {status: jest.fn().mockReturnThis(), send: jest.fn()};

  afterEach(() => {
    req = {query: {}};
    jest.clearAllMocks();
  });

  it('should return 400 if type is wrong', async () => {
    req.query.t = 'wrong';
    await main(req, res, prisma);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });

  it('should generate a random token', async () => {
    crypto.randomBytes = jest.fn().mockReturnValue('random');
    prisma.users = {update: jest.fn()};
    await generateApiKey(req, res, prisma);
    expect(crypto.randomBytes).toHaveBeenCalledTimes(1);
    expect(prisma.users.update).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should fetch the token', async () => {
    prisma.users = {findUnique: jest.fn(() => {
      return {apiKey: '123'};
    })};
    await getApiKey(req, res, prisma);
    expect(prisma.users.findUnique).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith({token: '123'});
  });
});
