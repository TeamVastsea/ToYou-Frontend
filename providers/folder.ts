import { Axios, AxiosResponse } from "axios";

export class Folder {
    private axios: Axios

    constructor(axios: Axios) {
        this.axios = axios;
    }
    getFolderInfo(id:string='1'): Promise<AxiosResponse<Fold>>{
        return this.axios.get('/folder/', {
            params: {
                id
            }
        })
    }
    create(parent: number, name: string){
        return this.axios.post('/folder', {parent,name})
    }
    rename(id: string, name: string){
        return this.axios.patch('/folder', undefined, {
            params: {
                id,
                name
            }
        })
    }
}

export interface Fold {
    child: number[] | null;
    create_time: string;
    depth: number;
    id: number;
    name: string;
    parent: null;
    size: number;
    update_time: string;
    user_id: number;
}