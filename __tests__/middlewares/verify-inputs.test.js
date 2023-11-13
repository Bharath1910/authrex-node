const verifyInputs = require('../../src/middleware/verify-inputs');
const {StatusCodes} = require('http-status-codes');

describe('verify inputs', () => {
  const req = {body: {}};
  const res = {status: jest.fn().mockReturnThis(), send: jest.fn()};
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if username/password is missing', () => {
    verifyInputs(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({});
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if username/password is present', () => {
    req.body.username = 'test';
    req.body.password = 'test';
    verifyInputs(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
