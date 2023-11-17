'use client'

import {Card, CardBody, CardFooter, CardHeader, Divider} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Spacer} from "@nextui-org/spacer";
import {ReactNode} from "react";
import {IsLoggedIn} from "@/interface/hooks";
import {useRouter} from "next/navigation";

export const Price = (price: PriceProps) => {
    const router = useRouter();
    function onStart() {
        if (IsLoggedIn) {
            if (price.price.price == 0) {
                router.push("/dashboard");
            } else {
                router.push("/buy");
            }
        } else {
            router.push("/authenticate");
        }
    }


    return (
        <>
            <Card style={{width: "auto"}}>
                <CardHeader className="flex gap-1">
                    <h1 className="font-bold text-3xl">{price.price.name}</h1>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p><b>-</b> 单图片体积 {price.price.singleFile}</p>
                    <p><b>-</b> {price.price.allSpace} 存储空间</p>
                    <p><b>-</b> 不限下载次数</p>
                    <p><b>-</b> 客户端与网页端</p>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <Button variant="ghost" color="primary" onClick={onStart}>开始使用</Button>
                    <Spacer style={{width: 20}}/>
                    <p>{price.price.price} 元/月</p>
                    <Spacer style={{width: 20}}/>
                    <p>{price.price.price * 10} 元/年</p>
                </CardFooter>
            </Card> <br />
            <p style={{textAlign: "center"}}> <b>若会员权益过期，超出存储空间部分将于 180 天内被删除，在删除其前您无法存储新的内容。</b> </p>
        </>
    )
}

export type PriceInfo = {
    name: ReactNode,
    singleFile: string,
    allSpace: string,
    price: number,
    plainName: string,
    disabled: string[]
}

type PriceProps = {
    price: PriceInfo
}
