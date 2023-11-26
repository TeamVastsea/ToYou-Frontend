import cookie from "react-cookies";
import {SERVER_URL} from "@/interface/api";
import {UserModel} from "@/interface/model/user";
import {Message} from "@/components/message";
import {SetLoggedInState} from "@/interface/hooks";

export class UserAPI {
    static async checkEmail(email: string): Promise<boolean> {
        //request
        let requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
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
            credentials: 'include',
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/user", requestOptions);
        let text = await response.text();

        return [response.ok, text];
    }

    static async login(username: String, password: String): Promise<[boolean, string]> {
        let requestOptions: RequestInit = {
            method: 'GET',
            // credentials: 'include',
            redirect: 'follow'
        };

        let response = await fetch(SERVER_URL + "/user?acccount=" + username + "&password=" + password, requestOptions);

        if (response.ok) {
            cookie.save("token", response.headers.get("token")!, {});
        }

        return [response.ok, await response.text()]
    }

    static async getExtendedInformation(): Promise<UserModel | undefined> {
        if (cookie.load("token") == null) {
            Message.error("登录状态过期");
            return undefined;
        }

        let headers = new Headers();
        headers.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
            headers: headers
        };

        let response = await fetch(SERVER_URL + "/user?extended=true", requestOptions);

        if (response.headers.get("token") != null) {
            cookie.save("token", response.headers.get("token")!, {});
        }

        let text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            Message.error("登录错误：" + e + ", " + text);
            cookie.remove("token");
            SetLoggedInState(false);
            return undefined;
        }
    }

    static async loginSession(): Promise<[boolean, string]> {
        if (cookie.load("token") == null) {
            return [false, ""];
        }

        let headers = new Headers();
        headers.append("token", cookie.load("token"));

        let requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
            headers: headers
        };

        try {

            let response = await fetch(SERVER_URL + "/user", requestOptions);

            if (response.headers.get("token") != null) {
                cookie.save("token", response.headers.get("token")!, {});
            }

            return [response.ok, await response!.text()];
        } catch (e) {
            Message.error("登录错误：" + e);
            cookie.remove("token");
            SetLoggedInState(false);
            return [false, "登录错误：" + e];
        }
    }
}