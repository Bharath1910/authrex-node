const express = require('express');
const prisma = require('./utils/prisma');
const redis = require('./utils/redis');
const cors = require('cors');
const {main: signup} = require('./routes/signup');
const {main: login} = require('./routes/login');
const {main: verifyUser} = require('./middleware/verify-user');
const {main: key} = require('./routes/key');
const {main: verifyAuth} = require('./middleware/verify-token');
const {main: token} = require('./routes/token');
const {rateLimiter} = require('./middleware/ratelimiter');
const {user} = require('./routes/user');
const verifyUserPwd = require('./middleware/verify-inputs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter(redis));

app.post('/signup',
    verifyUserPwd, verifyUser(prisma, redis),
    (req, res) => signup(req, res, prisma),
);

app.post('/login',
    verifyUserPwd, verifyUser(prisma, redis),
    (req, res) => login(req, res, prisma),
);

app.get('/key',
    verifyAuth(prisma),
    (req, res) => key(req, res, prisma),
);

app.get('/token',
    verifyAuth(prisma, true),
    (req, res) => token(req, res, redis),
);

app.post('/user',
    verifyAuth,
    (req, res) => user(req, res, prisma),
);

app.listen(5000, () => console.log('Server is running on port 5000'));
