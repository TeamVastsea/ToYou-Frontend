export interface CertifyInitializeRequest {
    identity_param: IdentityParam;
}
export interface StartCertifyRequest {
    certify_id: string;
}
export interface QueryCertifyRequest {
    certify_id: string
}

export interface CertifyInitializeResponse {
    certify_id: string;
}
export interface StartCertifyResponse {
    certify_url: string
}

export interface IdentityParam {
    /**
     * 真实姓名
     */
    cert_name: string;
    /**
     * 身份证号
     */
    cert_no: string;
}
