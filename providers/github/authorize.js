const qs = require('querystring');

const config = {
  client_id: '515dc353f8eb3d5cddd4',
  redirect_uri: 'http://localhost:3000',
  scope: 'user repo',
  allow_signup: false,
};

module.exports = token => {
  config.state = token;
  return `http://github.com/login/oauth/authorize?${qs.stringify(config)}`;
}
