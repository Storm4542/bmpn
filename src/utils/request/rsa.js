const NodeRSA = require('node-rsa')
// const JSEncrypt = require('jsencrypt')
import JSEncrypt from 'jsencrypt'

// const {JSEncrypt} = require('encryptlong')
const RSAPlugin = {
  MakeKey: async function() {
    const key = new NodeRSA({ b: 1024 }) //生成1024位的密钥
    return new Promise(resolve => {

      const publicKey = key.exportKey('pkcs8-public')//公钥
      const privateKey = key.exportKey('pkcs8-private')//私钥
      if (publicKey && privateKey) {
        resolve({
          publicKey, privateKey
        })
      }
    })
  },
  $RsaPubEncryptPub: function(publicKey, value) {
    const a = value.slice(0, 80)
    const b = value.slice(80, 160)
    console.log(value.length)
    const c = value.slice(160, value.length)
    const r = this.$RsaPubEncrypt(publicKey, a)
    const s = this.$RsaPubEncrypt(publicKey, b)
    const t = this.$RsaPubEncrypt(publicKey, c)
    return { r, s, t }
  },
  $RsaPubEncrypt: function(publicKey, value) {

    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(value)
  },
  $RsaPrvEncrypt: function(privateKey, value) {
    // const priKey = new NodeRSA(privateKey, 'pkcs8-private')
    // return priKey.encryptPrivate(value, 'base64')
    const encrypt = new JSEncrypt()
    encrypt.setPrivateKey(privateKey)
    return encrypt.encrypt(value)
  },
  $RsaPubDecrypt: function(publicKey, value) {
    // var key = new NodeRSA(publicKey, 'pkcs8-public')
    // return key.decryptPublic(value, 'utf8')
    console.log('***************解密')
    console.log(publicKey, value)
    const decrypt = new JSEncrypt()
    decrypt.setPublicKey(publicKey)
    return decrypt.decrypt(value)
  },
  $RsaPrvDecrypt: function(privateKey, value) {
    // return cryptico.decrypt(value, privateKey)
    // const priKey = new NodeRSA(privateKey, 'pkcs8-private')
    // return priKey.decrypt(value, 'utf8')
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privateKey)
    return decrypt.decrypt(value)
  }

}
RSAPlugin.install = function(Vue, options) {
  //(message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  //加密 公钥
  Vue.prototype.MakeKey = async function() {
    const key = new NodeRSA({ b: 1024 }) //生成2048位的密钥
    return new Promise(resolve => {

      const publicKey = key.exportKey('pkcs8-public-pem')//公钥
      const privateKey = key.exportKey('pkcs8-private-pem')//私钥
      if (publicKey && privateKey) {
        resolve({
          publicKey, privateKey
        })
      }

    })
  }
  //公钥加密
  Vue.prototype.$RsaPubEncrypt = function(publicKey, value) {

    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(value)
  }

  //加密 私钥
  Vue.prototype.$RsaPrvEncrypt = function(privateKey, value) {
    const encrypt = new JSEncrypt()
    encrypt.setPrivateKey(privateKey)
    return encrypt.encrypt(value)
  }

  //解密 公钥 -> 私钥加密的数据
  Vue.prototype.$RsaPubDecrypt = function(publicKey, value) {
    const decrypt = new JSEncrypt()
    decrypt.setPublicKey(publicKey)
    return decrypt.decrypt(value)
  }
  // //解密 私钥 ——> 公钥加密的数据
  Vue.prototype.$RsaPrvDecrypt = function(privateKey, value) {
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privateKey)
    return decrypt.decrypt(value)
  }
}
export default RSAPlugin
