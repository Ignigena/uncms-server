const api = require('./api');
const config = require('./config');

module.exports = async (code, state) => {
  let token = await api.post('/login/oauth/access_token', {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code,
  });

  if (token.data.error) {
    const err = new Error(token.data.error_description)
    err.code = token.data.error;
    err.uri = token.data.error_uri;
    throw err;
  }

  return token.data.access_token;
};
