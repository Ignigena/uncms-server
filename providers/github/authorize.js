const qs = require('querystring');

const config = require('./config');

module.exports = token => {
  let params = qs.stringify({
    allow_signup: false,
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    scope: config.scopes.join(' '),
    state: token,
  });

  return `http://github.com/login/oauth/authorize?${params}`;
}
