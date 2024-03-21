import { ShareMode } from "@/components/picture";
import { Axios } from "axios";


export class Share {
    private axios: Axios

    constructor(axios: Axios) {
        this.axios = axios;
    }

    share(password: string, content: string[]=[], mode: ShareMode=ShareMode.WATERMARK){
        return this.axios.post('/share', {password,content,mode})
    }
}