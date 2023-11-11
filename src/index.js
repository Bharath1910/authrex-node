const express = require('express');
const prisma = require('./utils/prisma');
const {execute: signup} = require('./routes/signup');

const app = express();

app.post('/signup', (req, res) => signup(req, res, prisma));

app.listen(5000, () => console.log('Server is running on port 5000'));
