export interface Picture {
    id: number;
    uid: number;
    pid: string;
    fileName: string;
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