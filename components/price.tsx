'use client'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Spacer} from "@nextui-org/spacer";

export const Price = (price: PricePrompt) => {

    return (
        <>
            <Card style={{width: 400}}>
                <CardHeader className="flex gap-1">
                    <h1 className="font-bold text-3xl">{price.price.name}</h1>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p>· 单图片最大 {price.price.singleFile}</p>
                    <p>· {price.price.allSpace} 存储空间</p>
                    <p>· {price.price.storageTime} 存储时间</p>
                    <p>· 无限流量</p>
                    <p>· 无限下载次数</p>
                    <p>· 不限速下载</p>
                    <p>· 手机app和网页端</p>
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
    name: string,
    singleFile: string,
    allSpace: string,
    storageTime: string,
    price: number
}

type PricePrompt = {
    price: PriceInfo
}