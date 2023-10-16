//在index.js中引入axios
import axios from 'axios';
//引入qs模块，用来序列化post类型的数据
import QS from 'qs';
//antd的message提示组件，大家可根据自己的ui组件更改。
import { message } from 'antd'
import toast, { Toaster } from 'react-hot-toast';
//保存环境变量
const isPrd = process.env.NODE_ENV == 'production';

//区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'https://fibosign.com/api/v1/': 'https://fibosign.com/api/v1/'

//设置axios基础路径
const service = axios.create({
  baseURL: basicUrl
})

// 请求拦截器
service.interceptors.request.use(config => { 
  // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
  // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
  const token = window.localStorage.getItem('userToken') || window.sessionStorage.getItem('userToken');
  //在每次的请求中添加token
  config.data = Object.assign({}, config.data, {
    Authorization: token,
  })
  //设置请求头
  config.headers = {
    'Content-Type':'application/json',  //发送json数据 
    // 'Access-Control-Allow-Origin': 'https://main.hzroc.art' 
  }
  config.headers['Authorization'] = token;
  //序列化请求参数，不然post请求参数后台接收不正常
  // config.data = QS.stringify(config.data)
  return config
}, error => { 
    return error;
})


// 定义响应拦截器 -->token值无效时,清空token,并强制跳转登录页
service.interceptors.response.use(function (response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, function (error) {
  console.log(error);
  // console.log(error)
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  if (error.response.status === 401) {
  }
  // else if()
  else {
    console.log("!11111111111111");
  }
  // return Promise.reject(error)
})


//最后把封装好的axios导出
export default service