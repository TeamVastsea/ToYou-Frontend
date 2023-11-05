export const SERVER_URL = "http://127.0.0.1:8102";

export async function checkEmail(email: string): Promise<boolean> {
    //request
    var requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    let response = await fetch(SERVER_URL + "/user/email/" + email, requestOptions);

    return await response.text() == "exists";
}

export async function creatUser(email: string, password: string, username: string, code: string): Promise<boolean> {

    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("username", username);
    formdata.append("code", code);

    var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    let response = await fetch(SERVER_URL + "/user", requestOptions);

    return response.ok;
}