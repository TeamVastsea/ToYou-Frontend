import { Message } from "@/components/message";
import axios from "axios";
import cookie from 'react-cookies';

export const http = axios.create({
    baseURL: '/api',
    timeout: 6000,
    withCredentials: true,
});

http.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined'){
            const token = cookie.load('token')
            const controller = new AbortController();
            if (!token){
                Message.error('登陆状态过期')
                controller.abort()
                config.signal = controller.signal;
            }
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
    switch (val.status){
        case 401:
            Message.error('登录状态过期')
        default:
            Message.error('登陆错误', val.data);
    }
    return Promise.reject(val);
})