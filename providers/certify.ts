import { CertifyInitializeRequest, CertifyInitializeResponse, StartCertifyRequest, StartCertifyResponse } from "@/interface/model/certify";
import { Axios } from "axios";

export class Certify{
    private axios: Axios;
    constructor(axios:Axios){
        this.axios = axios;
    }
    initialize({identity_param}: CertifyInitializeRequest){
        return this.axios.post<CertifyInitializeResponse>('/verify/init', identity_param);
    }
    start(data: StartCertifyRequest){
        return this.axios.post<StartCertifyResponse>('/verify/start', data);
    }
    queryCertifyResult(certify_id: string){
        return this.axios.get('/verify/query', {params: {certify_id}});
    }
    getCertifyState(){
        return this.axios.get('/user/certify');
    }
}