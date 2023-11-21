import { Axios } from "axios";
import {PictureList, ShareResponse} from "@/interface/model/picture";

export class Picture {
    private axios: Axios
    constructor(axios: Axios){
        this.axios = axios;
    }
    upload(file:File){
        const data = new FormData();
        data.append('file',file);
        data.append('fileName', file.name);

        return this.axios.postForm(`/picture?name=${file.name}`, data);
    }
    getList(){
        return this.axios.get('/picture')
    }
    sharePicture(pid: string, mode?:number, password?: string): Promise<ShareResponse>{
        return this.axios.post('/picture/share/', null, {
            params: {
                pid,
                shareMode: mode ?? 1,
                password: password ?? ''
            }
        })
    }
    changePictureName(name: string, id:string){
        return this.axios.patch('/picture',null, {
            params:{
                name
            }
        })
    }
}