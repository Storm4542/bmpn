export default {
    url: '/info',
    postInfo: '/pinfo',
    baseUrl: '',
    enableLocalStorageSecurity: false,//是否开启本地存储加密
    enableSecurity: false, //开启数据整体加密
    securityWhiteList: ['/auth/login', '/isc/login', '/auth/getRouters'],//加密白名单（不参与整体加密的url 例：['/login','/info']）
    enableIntegrityChecks: false,//是否开启完整性校验
    enableAntiReply: false, //是否开启防重放
    isHttps: false,
    isIsc: false //是否为isc
};
