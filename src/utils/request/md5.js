const CryptoJS = require('crypto-js')

const MD5Plugin = {
  $MD5Encrypt: function(value) {
    value = value || ''
    return CryptoJS.MD5(value).toString()
  }
}
MD5Plugin.install = function(Vue) {
  Vue.prototype.$MD5Encrypt = function(value) {
    value = value || ''
    return CryptoJS.MD5(value).toString()
  }

}
export default MD5Plugin
