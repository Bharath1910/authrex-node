const {main} = require('../src/routes/token');
const {StatusCodes} = require('http-status-codes');

describe('token', () => {
  it('should return 200 when token is valid', async () => {
    const req = {userId: 1};
    const res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
    const redis = {
      connect: jest.fn(),
      set: jest.fn(() => 1),
      disconnect: jest.fn(),
    };
    await main(req, res, redis);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
