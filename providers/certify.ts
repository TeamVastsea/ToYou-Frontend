import { CertifyInitializeRequest, CertifyInitializeResponse, StartCertifyRequest, StartCertifyResponse } from "@/interface/model/certify";
import { Axios } from "axios";

export class Certify{
    private axios: Axios;
    constructor(axios:Axios){
        this.axios = axios;
    }
    initialize({identity_param}: CertifyInitializeRequest){
        return this.axios.post<CertifyInitializeResponse>('/certify/initialize', identity_param);
    }
    start(data: StartCertifyRequest){
        return this.axios.post<StartCertifyResponse>('/certify/verify', data);
    }
    queryCertifyResult(certify_id: string){
        return this.axios.get('/certify/query', {params: {certify_id}});
    }
    getCertifyState(){
        return this.axios.get('/certify');
    }
}