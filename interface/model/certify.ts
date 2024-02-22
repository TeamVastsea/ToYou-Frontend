export interface CertifyInitializeRequest {
    identity_param: IdentityParam;
}
export interface StartCertifyRequest {
    certifyId: string;
}
export interface QueryCertifyRequest {
    certify_id: string
}

export interface CertifyInitializeResponse {
    certifyId: string;
}
export interface StartCertifyResponse {
    certifyUrl: string
}

export interface IdentityParam {
    /**
     * 真实姓名
     */
    certName: string;
    /**
     * 身份证号
     */
    certNo: string;
}
