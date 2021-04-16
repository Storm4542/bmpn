

const TokenKey = 'Authorization'

import uuid from '@/utils'
import md5 from '@/utils/request/md5'
import settings from '@/utils/request/settings'

export function generateKey() {
  if (!localStorage.getItem(md5.$MD5Encrypt(navigator.appVersion))) {
//浏览器版本
    localStorage.setItem(md5.$MD5Encrypt(navigator.appVersion), uuid(20))
  }
}

if (!localStorage.getItem(md5.$MD5Encrypt(navigator.appVersion))) {
//浏览器版本
  localStorage.setItem(md5.$MD5Encrypt(navigator.appVersion), uuid(20))
}
const getUUID = localStorage.getItem(md5.$MD5Encrypt(navigator.appVersion))

const sessionController = {}

sessionController.install = function(Vue) {

  Vue.prototype.getItem = function(key) {

    return settings.enableLocalStorageSecurity ? localStorage.getItem(md5.$MD5Encrypt(getUUID + key)) : localStorage.getItem(key)
  }
  Vue.prototype.setItem = function(key, value) {

    return settings.enableLocalStorageSecurity ? localStorage.setItem(md5.$MD5Encrypt(getUUID + key), value) : localStorage.setItem(key, value)
  }
  Vue.prototype.removeItem = function(key) {

    return settings.enableLocalStorageSecurity ? localStorage.removeItem(md5.$MD5Encrypt(getUUID + key)) : localStorage.removeItem(key)
  }
}

export function getItem(key) {

  return settings.enableLocalStorageSecurity ? localStorage.getItem(md5.$MD5Encrypt(getUUID + key)) : localStorage.getItem(key)
}

export function setItem(key, value) {

  return settings.enableLocalStorageSecurity ? localStorage.setItem(md5.$MD5Encrypt(getUUID + key), value) : localStorage.setItem(key, value)
}

export function removeItem(key) {

  return settings.enableLocalStorageSecurity ? localStorage.removeItem(md5.$MD5Encrypt(getUUID + key)) : localStorage.removeItem(key)
}

export default sessionController
