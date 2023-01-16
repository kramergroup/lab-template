import crypto from 'crypto'
import config from '../../app.config'

const clientOptions = {
  cypher: 'AES-256-CBC',
  key: config.backendToken
}

export const encrypt = (value) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(clientOptions.cypher, clientOptions.key, iv);

  let crypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
  crypted += cipher.final('base64');

  const data = {
      iv: iv.toString('base64'),
      value: crypted
  };

  return new Buffer(JSON.stringify(data)).toString('base64');
};

export default encrypt