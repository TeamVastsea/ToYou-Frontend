import { Axios } from "axios";

interface WechatPayParams {
  level: string,
  period: number,
  start_date: string;
}

export class Pay {
  private axios: Axios;
  constructor(axios: Axios){
    this.axios = axios;
  }
  wechat(param: WechatPayParams){
    return this.axios.post('/pay/wechat', param)
  }
}