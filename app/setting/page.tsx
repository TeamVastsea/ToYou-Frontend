'use client'

import {title} from "@/components/primitives";
import {Card, CardBody, Tab, Tabs} from "@nextui-org/react";
import {FiDatabase, FiLink, FiUser} from "react-icons/fi";
import {Button} from "@nextui-org/button";
import React from "react";
import ClickToEdit from "@/components/click-to-edit";
import {Message} from "@/components/message";

export default function SettingPage() {

    return (
        <div className="max-w-7xl space-y-10">
            <h1 className={title()}>用户设置</h1><br/>
            <Tabs key={"navigation"} aria-label="Options" color="primary" variant="bordered">
                <Tab key="user" title={
                    <div className="flex items-center space-x-2">
                        <FiUser/>
                        <span>用户管理</span>
                    </div>
                }>
                    <Card>
                        <CardBody className={"space-y-1"}>
                            <div className="flex items-center">
                                <p>当前实名：</p>
                                <Button className="capitalize" variant={"light"} onClick={() => {
                                    Message.success("更改实名");
                                }}>
                                    王*翔
                                </Button>
                            </div>

                            <div className="flex items-center">
                                <p>当前邮箱：</p>
                                <ClickToEdit default={"aaa@bbb.com"} onComplete={() => {
                                    Message.success("已发送验证码");
                                }} verify onVerify={(e) => {
                                    if (e == "") {
                                        Message.error("请输入验证码");
                                        return false;
                                    }
                                    Message.success("验证成功, 验证码：" + e);
                                    return true;
                                }}/>
                            </div>

                            <div className="flex items-center">
                                <p>当前手机号：</p>
                                <ClickToEdit default={"18511111111"} onComplete={() => {
                                    Message.success("已发送验证码");
                                }} verify onVerify={(e) => {
                                    if (e == "") {
                                        Message.error("请输入验证码");
                                        return false;
                                    }
                                    Message.success("验证成功, 验证码：" + e);
                                    return true;
                                }}/>
                            </div>

                            <div className="flex items-center">
                                <p>用户名：</p>
                                <ClickToEdit default={"Snowball_233"} onComplete={() => {
                                    Message.success("已保存")
                                }}/>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="photos" title={
                    <div className="flex items-center space-x-2">
                        <FiLink/>
                        <span>分享链接管理</span>
                    </div>
                }>
                </Tab>
                <Tab key="status" title={
                    <div className="flex items-center space-x-2">
                        <FiDatabase/>
                        <span>用户信息统计</span>
                    </div>
                }>

                </Tab>
            </Tabs>
            <div>
            </div>
        </div>
    );
}
