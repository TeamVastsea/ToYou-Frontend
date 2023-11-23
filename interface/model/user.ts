export interface Extend {
    storageUsed: number;
    userGroup: string;
    groupStartDate?: number;
    groupUpdateDate?: number;
    groupEndDate?: number;
}
export interface UserModel {
    uid: number;
    username: string;
    email: string;
    createTime: string;
    updateTime: string;
    extend?: Extend;
}
export interface LoginData {
    username: string;
    password: string;
}
export interface CheckCodeData {
    /**
     * 最短间隔时间 (ms)
     */
    cd: number;
}