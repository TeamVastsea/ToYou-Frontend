'use client'

import {title} from "@/components/primitives";
import {IsLoggedIn} from "@/interface/hooks";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/button";

export default function BuyPage() {
    let router = useRouter();
    let [group, setGroup] = useState("");
    let [state, setState] = useState(0);
    let [time, setTime] = useState("year");

    let pages = [
        <>
            <Card>
                <CardHeader>确认支付信息</CardHeader>
                <CardBody>
                    <div className={"space-y-10"}>
                        <p>请确认下方信息是否正确,如信息错误导致损失，我们不承担任何责任。</p>
                        <div className={"flex space-x-3"}>
                            <Select
                                label="请选择套餐"
                                className="max-w-xs"
                                labelPlacement={"outside"}
                            >
                                <SelectItem key="started" value="入门">
                                    入门
                                </SelectItem>
                                <SelectItem key="advanced" value="进阶">
                                    进阶
                                </SelectItem>
                                <SelectItem key="professional" value="专业">
                                    专业
                                </SelectItem>
                            </Select>
                            <ButtonGroup>
                                <Button color={time == "month" ? "primary" : "default"} onClick={() => {
                                    setTime("month")
                                }}>月度</Button>
                                <Button color={time == "quarter" ? "primary" : "default"} onClick={() => {
                                    setTime("quarter")
                                }}>季度</Button>
                                <Button color={time == "half" ? "primary" : "default"} onClick={() => {
                                    setTime("half")
                                }}>半年</Button>
                                <Button color={time == "year" ? "primary" : "default"} onClick={() => {
                                    setTime("year")
                                }}>年度</Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <p>支付方式</p>
                            <ButtonGroup>
                                <Button>微信支付</Button>
                                <Button>支付宝</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <Button color={"primary"} onClick={() => {
                        setState(1)
                    }}>下一步</Button>
                </CardFooter>
            </Card>
        </>,
        <>
            <Card>
                <CardHeader>支付</CardHeader>
                <CardBody>
                    <p>请扫描下方的二维码进行支付，支付成功后请点击下方的刷新按钮或直接前往用户中心。</p>
                    <p>将立即进行收费，恕不退款。</p>
                </CardBody>
                <Divider/>
                <CardFooter className={"space-x-3"}>
                    <Button color={"secondary"}>刷新</Button>
                    <Button variant={"light"} color={"danger"} onClick={() => {
                        setState(0);
                    }}>上一步</Button>
                </CardFooter>
            </Card></>
    ]
    return (
        <div className="max-w-7xl space-y-10">
            <h1 className={title()}>购买</h1>
            {pages[state]}
        </div>
    );
}
