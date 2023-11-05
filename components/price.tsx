'use client'

import {Card, CardBody, CardFooter, CardHeader, Divider} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Spacer} from "@nextui-org/spacer";
import {ReactNode} from "react";

export const Price = (price: PriceProps) => {

    return (
        <>
            <Card style={{width: 400}}>
                <CardHeader className="flex gap-1">
                    <h1 className="font-bold text-3xl">{price.price.name}</h1>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p><b>-</b> 单图片最大 {price.price.singleFile}</p>
                    <p><b>-</b> {price.price.allSpace} 存储空间</p>
                    <p><b>-</b> {price.price.storageTime} 存储时间</p>
                    <p><b>-</b> 无限流量</p>
                    <p><b>-</b> 无限下载次数</p>
                    <p><b>-</b> 不限速下载</p>
                    <p><b>-</b> 手机app和网页端</p>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <Button variant="ghost" color="primary">开始使用</Button>
                    <Spacer style={{width: 20}}/>
                    <p>{price.price.price} 元/月</p>
                </CardFooter>
            </Card>
        </>
    )
}

export type PriceInfo = {
    name: ReactNode,
    singleFile: string,
    allSpace: string,
    storageTime: string,
    price: number
}

type PriceProps = {
    price: PriceInfo
}
