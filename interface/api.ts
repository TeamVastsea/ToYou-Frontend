import cookie from "react-cookies";

export const SERVER_URL = "http://127.0.0.1:8102";

export class User {
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

        let formdata = new FormData();
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("username", username);
        formdata.append("code", code);

        let requestOptions: RequestInit = {
            method: 'POST',
            body: formdata,
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

        let response = await fetch(SERVER_URL + "/user?username=" + username + "&password=" + password, requestOptions);

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