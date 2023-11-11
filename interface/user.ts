import cookie from "react-cookies";
import {SERVER_URL} from "@/interface/api";

export class UserAPI {
    static async checkEmail(email: string): Promise<boolean> {
        //request
        var requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/user/email/" + email, requestOptions);

        return await response.text() == "exists";
    }

    static async creatUser(email: string, password: string, username: string, code: string): Promise<[boolean, string]> {

        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", username);
        formData.append("code", code);

        let requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/user", requestOptions);
        let text = await response.text();

        return [response.ok, text];
    }

    static async login(username: String, password: String): Promise<[boolean, string]> {
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/user?email=" + username + "&password=" + password, requestOptions);

        if (response.ok) {
            cookie.save("token", response.headers.get("token")!, {});
        }

        return [response.ok, await response.text()]
    }

    static async loginSession(): Promise<[boolean, string]> {
        if (cookie.load("token") == null) {
            return [false, ""];
        }


        let headers = new Headers();
        headers.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: headers
        };

        let response = await fetch(SERVER_URL + "/user", requestOptions);
        cookie.save("token", response.headers.get("token")!, {});

        return [response.ok, await response.text()];
    }
}