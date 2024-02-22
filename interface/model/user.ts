export interface Extend {
    storageUsed: number;
    userGroup: string;
    groupStartDate?: number;
    groupUpdateDate?: number;
    groupEndDate?: number;
}

export interface Level {
  level: string
  start: string
  end: string
}

export interface UserModel {
  id: number
  username: string
  phone: string
  email: any
  available: boolean
  level: Level
  root: number
  used_space: number
  create_time: string
  update_time: string
}

export interface LoginData {
    account: string;
    password: string;
}

export interface CheckCodeData {
    /**
     * 最短间隔时间 (ms)
     */
    cd: number;
}

export interface RegisterRequestData {
    /**
     * 验证码
     */
    code?: string;
    /**
     * 邮箱
     */
    email?: string;
    /**
     * 密码，由字母、数字、特殊字符，任意2种组成，6-20位
     */
    password: string;
    /**
     * 手机号
     */
    phone?: string;
    /**
     * 用户名，只能包含数字和字母，1-9位
     */
    username: string;
}
