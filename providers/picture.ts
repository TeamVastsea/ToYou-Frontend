import {Axios, AxiosProgressEvent, AxiosResponse} from "axios";
import {PictureList, ShareResponse} from "@/interface/model/picture";
import {ShareList} from "@/interface/model/share";

export class Picture {
    private axios: Axios

    constructor(axios: Axios) {
        this.axios = axios;
    }

    upload(file: File, onUpload?: (event: AxiosProgressEvent)=>void) {
        const data = new FormData();
        data.append('file', file);
        data.append('fileName', file.name);

        return this.axios.postForm(`/picture?name=${file.name}`, data, {
            onUploadProgress: onUpload
        });
    }

    getPicture(pid: string, token: string, mode: number=2){
        console.log(pid)
        return this.axios.get('/picture/preview', {
            headers: {
                Authorization: token
            },
            params: {
                mode,
                id: pid
            },
            responseType: 'blob'
        })
        .then((response) => response.data)
        .then((blob: Blob) => URL.createObjectURL(blob))
    }

    getList(dir:number=1, current:number=0, size:number=20):Promise<AxiosResponse<PictureList>> {
        return this.axios.get('/picture', {params: {
            dir,
            current,
            size
        }})
    }

    sharePicture(pid: string, mode?: number, password?: string): Promise<ShareResponse> {
        return this.axios.post('/picture/share/', null, {
            params: {
                pid,
                shareMode: mode ?? 1,
                password: password ?? ''
            }
        })
    }

    getAllSharedPicture(pageSize?: number, current?: number): Promise<AxiosResponse<ShareList>> {
        return this.axios.get('/picture/share', {
            params: {
                pageSize,
                current
            }
        })
    }

    changePictureName(name: string, id: string) {
        return this.axios.patch('/picture', null, {
            params: {
                name
            }
        })
    }

    deletePicture(pid: string) {
        return this.axios.delete('/picture/' + pid)
    }
}
