//Middleware de chiffrage de l'adresse mail

const CryptoJS = require("crypto-js");
const AES = require('aes-encryption')

const key = CryptoJS.enc.Hex.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.IV_KEY);

exports.encrypt = (field) => {

  return CryptoJS.AES.encrypt(field, key, {
    iv: iv
  }).toString();
}

exports.decrypt = (ciphertext) => {

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}