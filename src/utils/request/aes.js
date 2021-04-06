import store from '@/store'

const CryptoJS = require('crypto-js')
import { getItem, setItem, removeItem } from '@/utils/request/auth'

function prepareParams(iv) {
  let cfg = {}
  if (iv) {
    iv = CryptoJS.enc.Utf8.parse(iv)
    cfg.iv = iv
  }
  cfg.mode = CryptoJS.mode.CBC
  cfg.padding = CryptoJS.pad.Pkcs7

  return cfg
}

const AESPlugin = {
  $AesEncrypt: function(message, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    return CryptoJS.AES.encrypt(message, key, prepareParams(iv)).ciphertext.toString(CryptoJS.enc.Base64)
  },
  $AesDecrypt: function(ciphertext, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    return CryptoJS.AES.decrypt(ciphertext, key, prepareParams(iv)).toString(CryptoJS.enc.Utf8)
  },
  //单个加密时的方法
  $AesEncryptParam: function(message) {
    if (!message && message !== 0) return ''
    if (!getItem('ak') || !getItem('iv')) {
      return '未获取到key或者iv'
    }
    const key = CryptoJS.enc.Utf8.parse(getItem('ak'))
    return CryptoJS.AES.encrypt(message, key, prepareParams(getItem('iv'))).ciphertext.toString(CryptoJS.enc.Base64)
  },
  //单个解密
  $AesDecryptParam: function(ciphertext) {
    if (!ciphertext) return ''
    if (!getItem('ak') || !getItem('iv')) {
      return '未获取到key或者iv'
    }
    const key = CryptoJS.enc.Utf8.parse(getItem('ak'))
    return CryptoJS.AES.decrypt(ciphertext, key, prepareParams(getItem('iv'))).toString(CryptoJS.enc.Utf8)
  }

}
AESPlugin.install = function(Vue) {
  //(message, key, { iv: iv, format: CryptoJS.format.OpenSSL });

  //加密

  Vue.prototype.$AesEncrypt = function(message, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    return CryptoJS.AES.encrypt(message, key, prepareParams(iv)).ciphertext.toString(CryptoJS.enc.Base64)
  }
  //解密
  Vue.prototype.$AesDecrypt = function(ciphertext, key, iv) {
    key = CryptoJS.enc.Utf8.parse(key)
    return CryptoJS.AES.decrypt(ciphertext, key, prepareParams(iv)).toString(CryptoJS.enc.Utf8)
  }

  Vue.prototype.$AesEncryptParam = function(message) {
    if (!message) return ''
    if (!getItem('ak') || !getItem('iv')) {
      return '未获取到key或者iv'
    }
    const key = CryptoJS.enc.Utf8.parse(getItem('ak'))
    return CryptoJS.AES.encrypt(message, key, prepareParams(getItem('iv'))).ciphertext.toString(CryptoJS.enc.Base64)
  },
    //单个解密
    Vue.prototype.$AesDecryptParam = function(ciphertext) {
      if (!ciphertext) return ''
      if (!getItem('ak') || !getItem('iv')) {
        return '未获取到key或者iv'
      }
      const key = CryptoJS.enc.Utf8.parse(getItem('ak'))
      return CryptoJS.AES.decrypt(ciphertext, key, prepareParams(getItem('iv'))).toString(CryptoJS.enc.Utf8)
    }
}
export default AESPlugin
