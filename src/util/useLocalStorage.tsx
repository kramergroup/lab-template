import { useState, useEffect } from 'react'

import appConfig from '../../app.config';
import crypto from 'crypto'

const clientOptions = {
  cypher: 'AES-256-CBC',
  key: appConfig.backendToken
}

interface Data {
  iv: string,
  value: string,
}




export function useLocalStorage<T>(key: string, fallbackValue: T, encrypted: boolean = false) {
  
  const encrypt = (value : T) : string => {

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(clientOptions.cypher, clientOptions.key, iv);
  
    let crypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
    crypted += cipher.final('base64');
  
    const data : Data = {
        iv: iv.toString('base64'),
        value: crypted
    };
  
    return Buffer.from(JSON.stringify(data)).toString('base64');
  };
  
  const deencrypt = (value : string) : T => {
  
    const data = JSON.parse(value) as Data;
  
    const decipher = crypto.createDecipheriv(clientOptions.cypher, clientOptions.key, Buffer.from(data.iv,'base64'));
  
    let decryptedData = decipher.update(data.value, "base64", "utf-8");
    decryptedData += decipher.final("utf8");
  
    return JSON.parse(decryptedData) as T;
  };

  const encryptValue = (value) => (encrypted) ? encrypt(value) : value
  const deencryptValue = (value) => (encrypted) ? deencrypt(value) : value

  const [value, setValue] = useState(encryptValue(fallbackValue));
  
  useEffect(() => {
      const stored = deencryptValue(localStorage.getItem(key));
      setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [fallbackValue, key,encrypted]);

  useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}