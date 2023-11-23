import {SERVER_URL} from "@/interface/api";
import {Message} from "@/components/message";
import cookie from "react-cookies";
import {PictureList, ShareResponse} from "@/interface/model/picture";

export class PictureAPI {
    static async uploadFile(file: File) {
        let headers = new Headers();
        headers.append("token", cookie.load("token"));

        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name)

        let requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            credentials: 'include',
            redirect: 'follow',
            headers: headers
        };

        let response = await fetch(SERVER_URL + "/picture?name=" + file.name, requestOptions);
        if (!response.ok) {
            Message.error("上传失败：" + await response.text());
        } else {
            Message.success("上传成功");
        }
    }

    static async getPicturesList() {
        let headers = new Headers();
        headers.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
            headers: headers
        };

        let result = await fetch(SERVER_URL + "/picture", requestOptions);
        if (!result.ok) {
            Message.error("登录状态失效");
            cookie.remove('token');
            return;
        }
        let list: PictureList = JSON.parse(await result.text());
        console.log(cookie.load("token"));
        console.log(list);
        return list;
    }

    static async sharePicture(pid: string, sharMode?: number, password?: string): Promise<ShareResponse> {
        let myHeaders = new Headers();
        myHeaders.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        let res = await fetch(SERVER_URL + "/picture/share/" + pid + "?shareMode=" + (sharMode == undefined ? 1 : sharMode) + (password == null ? "" : "&password=" + password), requestOptions);

        return JSON.parse(await res.text());
    }

    static async changePictureName(name: string, id: string) {
        let myHeaders = new Headers();
        myHeaders.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(SERVER_URL + "/picture/" + id + "?name=" + name, requestOptions).catch((e) => {
            Message.error(e);
        });
    }
}