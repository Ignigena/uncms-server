const url = require('url');

const jwt = require('jsonwebtoken');
const { machineIdSync } = require('node-machine-id');
const qs = require('querystring');

const machineId = machineIdSync()

module.exports = async (req, res) => {
  const parsed = url.parse(req.url);
  const query = qs.parse(parsed.query);

  if (query.code) {
    const decoded = await jwt.verify(query.state, machineId);
    const token = await require(`./providers/${decoded.provider}/token`)(query.code, query.state);
    res.end(token);
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

  const token = await jwt.sign({ provider, repo }, machineId);
  const location = require(`./providers/${provider}/authorize`)(token);
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.end();
};
