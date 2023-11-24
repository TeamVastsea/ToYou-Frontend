import { CheckCodeData, LoginData, RegisterRequestData, UserModel } from "@/interface/model/user";
import { Axios } from "axios";

export class User {
    private axios: Axios;
    constructor(axios: Axios){
        this.axios = axios;
    }
    async checkEmail(email: string){
        return (await this.axios.get('/user/email', {params: {email}})).data === 'exists';
    }
    async createUser(data: RegisterRequestData){
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)){
            formData.append(key,value);
        }
        return this.axios.postForm<[Boolean, string]>('/user', formData);
    }
    async login(data: LoginData){
        return this.axios.get('user', {params: {email: data.username, password: data.password}});
    }
    async getExtendedInformation(){
        return this.axios.get('/user?extended=true');
    }
    async loginSession(){
        return this.axios.get('/user', { withCredentials: true });
    }
    async getCheckCodeByPhone(phone: string){
        return this.axios.get<CheckCodeData>('/user/code/phone', {params:{phone}});
    }
    async getCheckCodeByEmail(email: string){
        return this.axios.get<CheckCodeData>('/user/code/email', {params: {email}});
    }
}