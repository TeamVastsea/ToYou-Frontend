import {SERVER_URL} from "@/interface/api";
import {base} from "next/dist/build/webpack/config/blocks/base";

export class PictureAPI {
    static async uploadFile(file: File) {
        let formData = new FormData();
        formData.append("file", file);

        let requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        fetch(SERVER_URL + "/picture?name=" + file.name, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
}
async function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    })
}