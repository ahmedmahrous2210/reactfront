import React, { Component } from 'react';
import aes from 'crypto-js/aes'
import encHex from 'crypto-js/enc-hex'
//import config from 'config';
import { lib, PBKDF2 as _PBKDF2, algo as _algo, AES, enc as _enc } from "crypto-js";


function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
     
    return text;
  }

export function encryption(plain_text) {
    let passphrase = 'IBRAHIMIBOSOLKEYSET#$!@2023'//generateRandomString(5);
    var salt = lib.WordArray.random(256);
    var iv = lib.WordArray.random(16);

    var key = _PBKDF2(passphrase, salt, { hasher: _algo.SHA512, keySize: 64/8, iterations: 999 });
    var encrypted = AES.encrypt(plain_text, key, {iv: iv});
    var data = {
        ciphertext : _enc.Base64.stringify(encrypted.ciphertext),
        salt : _enc.Hex.stringify(salt),
        iv : _enc.Hex.stringify(iv) 
    }
    return btoa(JSON.stringify(data));
}

export function decryption(encrypted_json_string) {
    var obj_json = JSON.parse(encrypted_json_string);

    var encrypted = obj_json.ciphertext;
    var salt = _enc.Hex.parse(obj_json.salt);
    var iv = _enc.Hex.parse(obj_json.iv);   
    var passphrase = 'IBRAHIMIBOSOLKEYSET#$!@2023';   
    
    var key = _PBKDF2(passphrase, salt, { hasher: _algo.SHA512, keySize: 64/8, iterations: 999});
    var decrypted = aes.decrypt(encrypted, key, { iv: iv});

    return decrypted.toString(_enc.Utf8);
}