import { getItem, setItem } from '@/utils/request/auth'
import settings from '@/utils/request/settings'
import { Message, MessageBox } from 'element-ui'
import errorCode from '@/utils/errorCode'

export default {
  timeout: 20000,//超时时间
  requestInterceptors: {
    success: (config) => {
      //请求拦截器
      const Bearer = settings.isIsc ? 'Bearer ' : 'Bearer'
      if (getItem('Authorization')) {
        config.headers['Authorization'] = Bearer + getItem('Authorization') // 让每个请求携带自定义token 请根据实际情况自行修改
      }

      return config
    },
    error: (error) => {
      return Promise.reject(error)
    }
  }, //拦截器
  responseInterceptors: {
    success: (res) => {
        return sysRbacResponseInterceptors(res)
    },
    error: (error) => {

        Message({
          message: '服务器错误，请联系管理员',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
  }
}
function sysRbacResponseInterceptors(res) {
  console.log(res.data)
  const code = res?.data?.code || 200
  const message = res.data.msg || errorCode[code] || errorCode['default']
  if (code === 401) {
    MessageBox.alert(
      message,
      '系统提示',
      {
        showClose: false,
        confirmButtonText: '重新登录',
        type: 'warning'
      }
    ).then(() => {
      localStorage.clear()
      location.reload() // 为了重新实例化vue-router对象 避免bug
    })
  } else if (code !== 200) {
    console.log('出错了')
    Message.error(message)
    return Promise.reject(message)
  } else if (res.data) {
    return res.data
  } else {
    Message.error('服务器故障，请联系管理员')
  }
}
