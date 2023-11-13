import {SERVER_URL} from "@/interface/api";
import {base} from "next/dist/build/webpack/config/blocks/base";
import {Message} from "@/components/message";

export class PictureAPI {
    static async uploadFile(file: File) {
        let formData = new FormData();
        formData.append("file", file);

        let requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/picture?name=" + file.name, requestOptions);
        if (!response.ok) {
            Message.error("上传失败：" + await response.text());
        } else {
            Message.success("上传成功");
        }
    }

    static async getPicturesList() {
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        let result = await fetch(SERVER_URL + "/picture", requestOptions);
        console.log(result);
    }
}