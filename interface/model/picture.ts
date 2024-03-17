export interface Picture {
    id: number;
    uid: number;
    pid: string;
    file_name: string;
    size: number;
    downloads: number;
    createTime: string;
    updateTime: string;
}

export interface PictureList {
    records: Picture[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    optimizeJoinOfCountSql: boolean;
    maxLimit?: number;
    countId?: string;
    pages: number;
}

export interface ShareResponse {
    sid: string;
    id: number;
    password?: any;
    downloads?: any;
    shareMode: number;
    expiry: number;
    createTime?: any;
    updateTime?: any;
    available?: any;
}