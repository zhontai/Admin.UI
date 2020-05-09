import CryptoJS from 'crypto-js'

/**
 * 加密
 * @param {string} message 需要加密的字符串
 * @param {string} key 密钥
 * @return {string}
 */
export function encryptByDES(message, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
 * 解密
 * @param {string} cipherText 密文
 * @param {string} key 密钥
 * @return {string}
 */
export function decryptByDES(cipherText, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key)
  var decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )

  return decrypted.toString(CryptoJS.enc.Utf8)
}
