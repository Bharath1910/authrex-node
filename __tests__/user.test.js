const {
  parseOptions,
  updateOptions,
  updateRedirect,
} = require('../src/routes/user.js');

describe('user', () => {
  it('should throw error if the methods are invalid', () => {
    expect(() => parseOptions('invalid')).toThrow();
  });

  it('should return the valid methods', () => {
    expect(parseOptions('username,pgp')).toEqual(['username', 'pgp']);
  });
});
