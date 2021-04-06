import settings from './settings'

const qs = require('qs')

import uuid from '../index'
import { getItem } from '@/utils/request/auth'

import md5 from './md5'
import axios from 'axios'
import aes from './aes'
import rsa from './rsa'

import axiosSettings from '@/utils/request/axiosSettings'

const BASE_URL = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : settings.baseUrl + process.env.VUE_APP_BASE_API

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: axiosSettings.timeout
})

instance.interceptors.request.use(
  config => {
    // do something before request is sent

    return axiosSettings.requestInterceptors.success(config)
  },
  error => {
    // do something with request error
    return axiosSettings.requestInterceptors.error(error)

  }
)

instance.interceptors.response.use(res => {
    return axiosSettings.responseInterceptors.success(res)
  },
  error => {
    return axiosSettings.responseInterceptors.error(error)
  }
)

function generateData(params) {
  params = params || {}

  const keys = Object.keys(params)
  const desKeys = keys.sort().reverse()

  let data = []
  desKeys.forEach(item => {
    if (!(params[item] instanceof Array && params[item].length === 0)) {
      data.push(params[item])
    }
  })

  return data.join(',')

}

async function GET(url, params, headers, config, security) {

  return new Promise((resolve, reject) => {
    //排序
    const _stime = new Date().getTime() - parseInt(getItem('st')) || 0
    const _uuid = uuid(32)
    url = handleUrl(url)
    /**
     * 数据加密
     */
    if (security || settings.enableSecurity) {

      params = encryptData(headers, params, url)

    }
    /**
     *  防重放
     */
    if (settings.enableAntiReply) {
      headers = AntiReply(headers, _stime, _uuid)
    }

    /**
     *完整性校验
     */
    if (settings.enableIntegrityChecks) {
      headers = IntegrityChecks(headers, url, params, _stime, _uuid)

    }
    if (typeof config.headers !== 'object' || Array.isArray(config.headers)) {
      config.headers = {}
    }
    headers = Object.assign(config.headers, headers)
    params = qs.stringify(params, { arrayFormat: 'repeat' })

    instance.get(url + '?' + params, { headers, ...config }).then((res) => {
      // 此处作用很大，可以扩展很多功能。
      // 比如对接多个后台，数据结构不一致，可做接口适配器
      // 也可对返回日期/金额/数字等统一做集中处理

      resolve(res)

    }).catch(e => reject(e))
  })
}

async function POST(url, params, headers, config, security) {

  //排序
  let data = {}
  const _stime = new Date().getTime() - parseInt(getItem('st')) || 0
  const _uuid = uuid(32)
  url = handleUrl(url)

  /**
   * 数据加密
   */

  if (security || settings.enableSecurity) {
    params = encryptData(headers, params, url)
  }

  /**
   *  防重放
   */
  if (settings.enableAntiReply) {
    headers = AntiReply(headers, _stime, _uuid)
  }
  /**
   * 完整性校验
   */
  if (settings.enableIntegrityChecks) {
    headers = IntegrityChecks(headers, url, params, _stime, _uuid)
  }

  if (headers['content-type'] === 'application/x-www-form-urlencoded') {
    data = qs.stringify(params, {
      arrayFormat: 'repeat',
      allowDots: true
    })

  } else {
    data = params
  }
  if (typeof config.headers !== 'object' || Array.isArray(config.headers)) {
    config.headers = {}
  }
  headers = Object.assign(config.headers, headers)

  return instance.post(url, data, {
    ...headers,
    ...config
  }).then((res) => {
    // 此处作用很大，可以扩展很多功能。
    // 比如对接多个后台，数据结构不一致，可做接口适配器
    // 也可对返回日期/金额/数字等统一做集中处理

    return res
  }).catch(e => e)
}

/**
 * 防重放
 */
function AntiReply(headers, _stime, _uuid) {
  // if (!store.getters.uid || !store.getters.stime) {
  //   Message.error('尚未获取到uid和stime')
  //   return
  // }

  headers['a'] = md5.$MD5Encrypt(getItem('ud') + _stime + _uuid)

  headers['u'] = _uuid
  headers['t'] = _stime
  return headers
}

/**
 * 完整性校验
 *
 */
function handleUrl(url) {

  url = url || ''
  url = url.split(' ').join('')
  const arr = url.split('/')
  let tempArr = []

  arr.forEach(u => {
    if (u !== '') {
      tempArr.push(u)
    }
  })
  tempArr.unshift('')
  return tempArr.join('/')
}

function IntegrityChecks(headers, url, params, _stime, _uuid) {

  let desData
  // if (!store.getters.uid || !store.getters.stime) {
  //   Message.error('尚未获取到uid和stime')
  //   return
  // }

  if (headers['content-type'] === 'application/x-www-form-urlencoded') {
    desData = params ? generateData(params) : ''

  } else {
    desData = params ? JSON.stringify(params) : ''
  }

  headers['b'] = md5.$MD5Encrypt(getItem('ud') + _stime + _uuid + url + desData)
  // headers['b'] = md5.$MD5Encrypt(getItem('ud') + _stime + _uuid + desData)
  headers['u'] = _uuid
  headers['t'] = _stime
  return headers
}

/**
 * 数据加密
 * @param headers
 * @param params
 * @param _uuid
 * @returns {{p1: *, p2: *, p3: *}}
 */
function encryptData(headers, params, url) {
  if (settings.securityWhiteList.find(u => u === url)) return params
  const publicKey = getItem('pk')
  const key = uuid(32)
  const iv = uuid(16)
  let p1
  if (headers['content-type'] === 'application/x-www-form-urlencoded') {
    p1 = aes.$AesEncrypt(qs.stringify(params, {
      arrayFormat: 'repeat',
      allowDots: true
    }), key, iv)
  } else {
    p1 = aes.$AesEncrypt(JSON.stringify(params), key, iv)
  }

  const p2 = rsa.$RsaPubEncrypt(publicKey, key)
  const p3 = rsa.$RsaPubEncrypt(publicKey, iv)
  return { p1, p2, p3 }
}

function Get(url, config) {
  return instance.get(url, config)
}

function httpGet(url, params, config) {
  config = config || {}
  return GET(url, params, { 'content-type': 'application/x-www-form-urlencoded' }, config)
}

function securityHttpGet(url, params, config) {
  const security = true
  config = config || {}
  return GET(url, params, { 'content-type': 'application/x-www-form-urlencoded' }, config, security)
}

// 封装POST请求
function httpPost(url, params, config) {
  config = config || {}
  return POST(url, params, { 'content-type': 'application/x-www-form-urlencoded' }, config)
}

function securityHttpPost(url, params, config) {
  config = config || {}
  const security = true
  return POST(url, params, { 'content-type': 'application/x-www-form-urlencoded' }, config, security)
}

function httpPostJson(url, params, config) {
  config = config || {}
  return POST(url, params, { 'content-type': 'application/json' }, config)
}

function securityHttpPostJson(url, params, config) {
  config = config || {}
  const security = true
  return POST(url, params, { 'content-type': 'application/json' }, config, security)
}

export function request(config) {

  if ((config.method).toLowerCase() === 'get') {
    return httpGet(config.url, config.params)
  } else {
    return httpPostJson(config.url, config.data)
  }
}

export default {
  httpGet, httpPost, httpPostJson, securityHttpGet, securityHttpPost, securityHttpPostJson, Get
}

// 通用下载方法
export function download(url, params, filename) {
  return httpPost(url, params, {
    responseType: 'blob'
  }).then((data) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

export async function downloadImg(url) {

  return new Promise(resolve => {
    httpGet(url, {}, {
      responseType: 'blob'
    }).then((data) => {
      const content = data
      var src = ''
      const blob = new Blob([content])
      var reader = new FileReader()
      reader.readAsDataURL(blob) // 转换为base64，可以直接放入a标签href
      reader.onload = function(e) {
        src = e.target.result
        resolve(src)
      }

    }).catch((r) => {
      console.error(r)
    })
  })

}
