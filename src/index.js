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
const verifyUserPwd = require('./middleware/verify-inputs');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup',
    verifyUserPwd, verifyUser(prisma, redis),
    (req, res) => signup(req, res, prisma),
);

app.post('/login',
    verifyUserPwd, verifyUser(prisma, redis),
    (req, res) => login(req, res, prisma),
);

app.get('/key',
    verifyAuth,
    (req, res) => key(req, res, prisma),
);

app.get('/token',
    verifyAuth, verifyUser(prisma, redis),
    (req, res) => token(req, res, redis),
);

app.listen(5000, () => console.log('Server is running on port 5000'));
