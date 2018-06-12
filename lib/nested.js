const needle = require('needle');

exports.sendPost = async (user, data) => await this.callApi('post/add', data, user);

exports.callApi = async (cmd, data, user) => {
  const cyrus = await exports.getCyrusServer(user.app_domain);
  return new Promise((resolve, reject) => {
    needle.post(cyrus, {
      cmd,
      data,
      _reqid: 'REQID' + Date.now(),
      _app_id: user.app_id,
      _app_token: user.app_token,
    }, { json: true })
    .on('response', (resp) => {
      resolve();
    })
    .on('err', reject);
  });
}

exports.getCyrusServer = async (origin) => {
  const getConfigUrl = `https://npc.nested.me/dns/discover/${origin}`;
  return new Promise(
    (resolve, reject) => needle.get(getConfigUrl, (error, response) => {
      if (!error && response.statusCode == 200 && response.body) {
        const newConfigs = parseConfigFromRemote(response.body.data);
        return resolve(newConfigs.register);
      } else {
        return reject(error);
      }
    })
  );
}

function parseConfigFromRemote(data) {
  const cyrus = [];
  data.forEach((configs) => {
    const config = configs.split(';');
    config.forEach((item) => {
      if (item.substring(0, 6) === 'cyrus:') {
        cyrus.push(item);
      }
    });
  });
  let cyrusHttpUrl = '';
  let cyrusWsUrl = '';
  let config = {};
  cyrus.forEach((item) => {
    config = parseConfigData(item);
    if (config.protocol === 'http' || config.protocol === 'https') {
      cyrusHttpUrl = getCompleteUrl(config);
    } else if (config.protocol === 'ws' || config.protocol === 'wss') {
      cyrusWsUrl = getCompleteUrl(config);
    }
  });

  return {
    websocket: cyrusWsUrl + '/api',
    register: cyrusHttpUrl + '/',
    store: cyrusHttpUrl + '/file',
  };
}
function getCompleteUrl(config) {
  return config.protocol + '://' + config.url + ':' + config.port;
}
function parseConfigData(data) {
  const items = data.split(':');
  return {
    name: items[0],
    protocol: items[1],
    port: items[2],
    url: items[3],
  };
}