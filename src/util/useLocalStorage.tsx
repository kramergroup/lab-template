import { useState, useEffect } from 'react'

import appConfig from '../../app.config';
import crypto from 'crypto'
import { LocalLaundryService } from '@mui/icons-material';

const clientOptions = {
  cypher: 'AES-256-CBC',
  key: appConfig.backendToken
}

interface Data {
  iv: string,
  value: string,
}

export function useLocalStorage<T>(key: string, fallbackValue: T, encrypted: boolean = false) {
  
  const encrypt = (value : T) : Data => {

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(clientOptions.cypher, clientOptions.key, iv);
  
    let crypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
    crypted += cipher.final('base64');
  
    const data : Data = {
        iv: iv.toString('base64'),
        value: crypted
    };
  
    return data;
  };
  
  const deencrypt = (data : Data) : T => {
  
    const decipher = crypto.createDecipheriv(clientOptions.cypher, clientOptions.key, Buffer.from(data.iv,'base64'));
  
    let decryptedData = decipher.update(data.value, "base64", "utf8");
    decryptedData += decipher.final("utf8");
  
    return JSON.parse(decryptedData) as T;
  };

  const encryptValue = (value) => (encrypted) ? encrypt(value) : value
  const deencryptValue = (value) => (encrypted) ? deencrypt(value) : value

  const [value, setValue] = useState(fallbackValue);
  
  useEffect(() => {
    const payload = JSON.parse(localStorage.getItem(key))
    setValue(payload ? deencryptValue(payload) : fallbackValue);
  }, [fallbackValue, key,encrypted]);

  useEffect(() => {
    (value === undefined) ? 
      localStorage.removeItem("key") :
      localStorage.setItem(key, JSON.stringify(encryptValue(value)));
  }, [key, value]);

  return [value, setValue] as const;
}