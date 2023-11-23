import { LoginData, UserModel } from "@/interface/model/user";
import { Axios } from "axios";

export class User {
    private axios: Axios;
    constructor(axios: Axios){
        this.axios = axios;
    }
    async checkEmail(email: string){
        return (await this.axios.get('/user/email', {params: {email}})).data === 'exists'
    }
    async creaetUser(model: UserModel){
        const formData = new FormData();
        for (const [key, data] of Object.entries(model)){
            formData.append(key, data);
        }
        return this.axios.postForm('/user', formData)
    }
    async login(data: LoginData){
        return this.axios.get('user', {params: {email: data.username, password: data.password}})
    }
    async getExtendedInformation(){
        return this.axios.get('/user?extended=true');
    }
    async loginSession(){
        return this.axios.get('/user', { withCredentials: true })
    }
}