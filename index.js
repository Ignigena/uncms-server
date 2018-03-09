const url = require('url');

const jwt = require('jsonwebtoken');
const { machineIdSync } = require('node-machine-id');
const qs = require('querystring');

const { send } = require('micro')

const machineId = machineIdSync()

module.exports = (req, res) => {
  const parsed = url.parse(req.url);
  const query = qs.parse(parsed.query);
  if (query.code) {
    jwt.verify(query.state, machineId, function(err, decoded) {
      if (err) throw new Error(err);
      res.end(decoded.repo);
    });
    return;
  }

  if (query.error) {
    const err = new Error(query.error_description)
    err.code = query.error;
    err.uri = query.error_uri;
    throw err;
  }

  const project = parsed.path.substr(1).split(':');
  const provider = project[0];
  const repo = project[1];

  jwt.sign({ repo }, machineId, function(err, token) {
    const location = require(`./providers/${provider}/authorize`)(token);
    res.statusCode = 302;
    res.setHeader('Location', location);
    res.end();
  });
};
