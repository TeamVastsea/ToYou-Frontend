import { Axios } from "axios";


export class Share {
    private axios: Axios

    constructor(axios: Axios) {
        this.axios = axios;
    }

    share(content: string[]=[], mode: number=0, password?: string){
        return this.axios.post('/share', {password,content,mode})
    }
    sharePicture(content: string[], mode: number=0, password?:string){
        return this.share(content.map((c)=>`p${c}`), mode, password)
    }
}