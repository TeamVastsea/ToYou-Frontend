export interface Share {
    sid: string;
    id: number;
    uid: number;
    password: boolean;
    downloads: number;
    shareMode: number;
    expiry: number;
    fileName: string;
}

export interface ShareList {
    records: Share[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    optimizeJoinOfCountSql: boolean;
    maxLimit?: any;
    countId?: any;
    pages: number;
}