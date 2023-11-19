const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');

const {main: verifyToken} = require('../../src/middleware/verify-token');

jest.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = {headers: {}};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  test('should pass with a valid token', async () => {
    const token = 'valid_token';
    req.headers['authorization'] = `Bearer ${token}`;
    const decodedToken = {id: 'user_id'};

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, decodedToken);
    });

    const mid = verifyToken(verifyKey=false);
    await mid(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET,
        expect.any(Function),
    );
    expect(req.userId).toBe(decodedToken.id);
    expect(next).toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED with no token provided', async () => {
    const mid = verifyToken(verifyKey=false);
    await mid(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledWith({message: 'No token provided.'});
    expect(next).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED with invalid token', async () => {
    const token = 'invalid_token';
    req.headers['authorization'] = `Bearer ${token}`;

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    const mid = verifyToken(verifyKey=false);
    await mid(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledWith({message: 'Unauthorized.'});
    expect(next).not.toHaveBeenCalled();
  });
});
