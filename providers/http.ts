import {Message} from "@/components/message";
import axios, {AxiosError} from "axios";
import cookie from 'react-cookies';
import qs from 'qs';

// 用于存储pending的请求（处理多条相同请求）
const pendingRequest = new Map()

// 生成request的唯一key
const generateRequestKey = (config: any) => {
  // 通过url，method，params，data生成唯一key，用于判断是否重复请求
  // params为get请求参数，data为post请求参数
  const { url, method, params, data } = config
  return [url, method, qs.stringify(params), qs.stringify(data)].join('&')
}

// 将重复请求添加到pendingRequest中
const addPendingRequest = (config: any) => {
  const key = generateRequestKey(config)
  if (!pendingRequest.has(key)) {
    config.cancelToken = new axios.CancelToken(cancel => {
      pendingRequest.set(key, cancel)
    })
  }
}

// 取消重复请求
const removePendingRequest = (config: any) => {
  const key = generateRequestKey(config)
  if (pendingRequest.has(key)) {
    const cancelToken = pendingRequest.get(key)
    cancelToken(key) // 取消之前发送的请求
    pendingRequest.delete(key)// 请求对象中删除requestKey
  }
}

export const http = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : process.env.NEXT_PUBLIC_API_SERVER,
    timeout: 6000,
    withCredentials: true,
});

http.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = cookie.load('token')
            if (token) {
                config.headers.token = token;
            }
        }
        removePendingRequest(config);
        addPendingRequest(config);
        return config;
    },
    (err) => {
        console.log(err);
        throw new Error(err);
    }
)
http.interceptors.response.use((val) => {
    return val;
}, (err: AxiosError) => {
    const msg = typeof err.response?.data === 'object' ? JSON.stringify(err.response?.data ?? {}) : err.response?.data
    Message.error(JSON.stringify(msg));
    return Promise.reject(err);
})
