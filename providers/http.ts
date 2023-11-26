import { Message } from "@/components/message";
import axios, { AxiosError } from "axios";
import cookie from 'react-cookies';

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER,
    timeout: 6000,
    withCredentials: true,
});

http.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined'){
            const token = cookie.load('token')
            // const controller = new AbortController();
            // // if (!token){
            // //     Message.error('登陆状态过期')
            // //     controller.abort()
            // //     config.signal = controller.signal;
            // // }
            if (token){
                config.headers.token = token;
            }
        }
        return config;
    },
    (err)=>{
        throw new Error(err);
    }
)
http.interceptors.response.use((val)=>{
    
    return val;
    return Promise.reject(val);
}, (err: AxiosError)=>{
    const status = err.response?.status ?? {};
    switch (status){
        case 401:
            Message.error('登录状态过期')
            break;
        case 404:
            Message.error('接口不存在')
            break;
        case 429:
            Message.error('请求过快')
            break;
        default:
            Message.error(`登陆错误: ${err.response?.data}`);
            console.error(err.response?.data)
    }
    return Promise.reject(err);
})