export interface Share {
    sid: string;
    id: number;
    uid: number;
    password?: any;
    downloads: number;
    shareMode: number;
    expiry: number;
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