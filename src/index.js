const express = require('express');
const prisma = require('./utils/prisma');
const {main: signup} = require('./routes/signup');
const {main: login} = require('./routes/login');

const app = express();

app.use(express.json());

app.post('/signup', (req, res) => signup(req, res, prisma));
app.post('/login', (req, res) => login(req, res, prisma));

app.listen(5000, () => console.log('Server is running on port 5000'));
