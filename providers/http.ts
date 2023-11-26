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
            if (token){
                config.headers.token = token;
            }
        }
        return config;
    },
    (err)=>{
        console.log(err);
        throw new Error(err);
    }
)
http.interceptors.response.use((val)=>{
    
    return val;
}, (err: AxiosError)=>{
    const msg = typeof err.response?.data === 'object' ? JSON.stringify(err.response?.data ?? {}) : '未知错误'
    Message.error(msg);
    return Promise.reject(err);
})