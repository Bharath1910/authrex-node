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

  it('should update the redirect', async () => {
    const req = {
      userId: 1,
      query: {redirect: 'https://example.com'},
    };
    const prisma = {
      users: {
        update: jest.fn(),
      },
    };
    await updateRedirect(req, {}, prisma);
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: {id: req.userId},
      data: {redirect: req.query.redirect},
    });
  });

  it('should do nothig if redirect is not present', async () => {
    const req = {
      userId: 1,
      query: {},
    };
    const prisma = {
      users: {
        update: jest.fn(),
      },
    };
    await updateRedirect(req, {}, prisma);
    expect(prisma.users.update).not.toHaveBeenCalled();
  });

  it('should update the options', async () => {
    const req = {
      userId: 1,
      query: {options: 'username,pgp'},
    };
    const prisma = {
      users: {
        update: jest.fn(),
      },
    };
    await updateOptions(req, {}, prisma);
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: {id: req.userId},
      data: {methods: ['username', 'pgp']},
    });
  });

  it('should do nothig if options is not present', async () => {
    const req = {
      userId: 1,
      query: {},
    };
    const prisma = {
      users: {
        update: jest.fn(),
      },
    };
    await updateOptions(req, {}, prisma);
    expect(prisma.users.update).not.toHaveBeenCalled();
  });
});
