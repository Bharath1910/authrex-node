const express = require('express');
const prisma = require('./utils/prisma');

const app = express();

app.listen(5000, () => console.log('Server is running on port 5000'));
