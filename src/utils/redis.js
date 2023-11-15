const {createClient} = require('redis');

const client = createClient({
  url: process.env.REDIS_URL,
}).on('error', (err) => {
  console.log('Redis Client Error', err);
});

module.exports = client;
