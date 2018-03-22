const axios = require('axios');

const ghapi = axios.create({
  baseURL: 'https://github.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

module.exports = ghapi;
