import {SERVER_URL} from "@/interface/api";
import {Message} from "@/components/message";
import cookie from "react-cookies";
import {PictureList} from "@/interface/model/picture";

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
        console.log(list);
        return list;
    }
}