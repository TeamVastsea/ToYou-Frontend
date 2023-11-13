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