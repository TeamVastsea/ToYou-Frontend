'use client'
import {title} from "@/components/primitives";
import {
    ButtonProps,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    useDisclosure
} from "@nextui-org/react";
import {FiDatabase, FiLink, FiUser} from "react-icons/fi";
import {Button} from "@nextui-org/button";
import React, {ReactNode, useState} from "react";
import ClickToEdit from "@/components/click-to-edit";
import {Message} from "@/components/message";
import ShareTable from "@/components/share-table";
import IOC from "@/providers";
import Password from "@/components/password";
import { setRawCookie } from "react-cookies";

interface SettingItem {
    label: string;
    button: {
        variant: ButtonProps['variant'];
        onClick: ButtonProps['onClick'];
        children: ReactNode;
    };
    ClickToEdit: {
        default: string;
        onComplete: (value: string)=>void
        verify?: boolean;
        onVerify?: (value: string)=>boolean;
    };
    text: {
        children: ReactNode
    }
}
const useForceUpdate = ()=>{
    let [value, setState] = useState(true);
    return () => setState(!value);
}
const renderItems = (item: Partial<SettingItem>) => {
    const label = () => <p className="text-right">{item.label}</p>
    const button = () => {
        if (item.button){
            return (
                <Button className="capitalize w-fit" variant={item.button.variant} onClick={item.button.onClick}>
                    {item.button.children}
                </Button>
            )
        }
    }
    const edit = () => {
        if (item.ClickToEdit){
            return (
                <ClickToEdit {...item.ClickToEdit} />
            )
        }
    }
    const text = () => {
        if (item.text){
            return (
                <div className="px-unit-4 cursor-pointer">
                    <span className="text-blue-500 dark:text-blue-600">{item.text.children}</span>
                </div>
            )
        }
    }
    return (
        <>
            {item.label && label()}
            {item.text && text()}
            {item.button && button()}
            {item.ClickToEdit && edit()}
        </>
    )
}
export const useSettingItems = (
    items: Partial<SettingItem>[]
) => {
    return (
        <a className="space-y-1">
            {
                items.map((item,idx) => {
                    return (
                        <div className="grid grid-cols-[100px_1fr] justify-start items-center gap-2" key={idx}>
                            {renderItems(item)}
                        </div>
                    )
                })
            }
        </a>
    )
}

export default function SettingPage() {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    // TODO: get by API or local cache
    let rawUsername = 'SnowBall_233';
    const [userName, setUserName] = useState('SnowBall_233');
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);

    const onChangePassword = () => {
        if (!oldPwd){
            Message.error('老密码不能为空')
            return;
        }
        if (!newPwd){
            Message.error('新密码不能为空')
            return;
        }
        if (newPwd === oldPwd) {
            Message.error('新密码不能与老密码相同')
            setNewPwd('');
            return;
        }
        setLoading(true)
        IOC.user.changePassword(newPwd, oldPwd)
        .catch()
        .finally(()=>{
            setLoading(false);
        })
    }
    const onCancel = () => {
        setNewPwd('');
        setOldPwd('');
        onClose()
    }
    const items: Partial<SettingItem>[] = [
        {
            label: '当前实名:',
            button:{
                children: '姓名',
                onClick: ()=>{
                    Message.success("更改实名");
                },
                variant: 'light'
            },
        },
        {
            label: '当前邮箱:',
            ClickToEdit: {
                default: 'aaa@bbb.com',
                onComplete: ()=>{
                    Message.success("已发送验证码");
                },
                verify: true,
                onVerify:(e) => {
                    if (e == "") {
                        Message.error("请输入验证码");
                        return false;
                    }
                    Message.success("验证成功, 验证码:" + e);
                    return true;
                },
            }
        },
        {
            label: '当前手机号:',
            ClickToEdit:{
                default: '18511111111',
                onComplete: ()=>{
                    Message.success("已发送验证码");
                },
                verify: true,
                onVerify: (e)=>{
                    if (e) {
                        Message.error("请输入验证码");
                        return false;
                    }
                    Message.success("验证成功, 验证码:" + e);
                    return true;
                },
            }
        },
        {
            label: '用户名',
            ClickToEdit:{
                default: userName,
                onComplete: async (value)=>{
                    return IOC.user.changeUserName(value)
                    .then(()=>{
                        setUserName(value);
                        rawUsername = value;
                        return true;
                    })
                    .catch(()=>{
                        setUserName(rawUsername)
                        return true;
                    })
                },
            }
        },
    ]
    return (
        <div className="w-full space-y-10">
            <h1 className={title()}>用户设置</h1><br/>
            <Tabs key={"navigation"} aria-label="Options" color="primary" variant="bordered">
                <Tab key="user" title={
                    <div className="flex items-center space-x-2">
                        <FiUser/>
                        <span>用户管理</span>
                    </div>
                }>
                    <Card className="w-full max-w-sm">
                        <CardBody className={"space-y-1 w-full"}>
                            <div>
                                {useSettingItems(items)}
                                <div className="grid grid-cols-[100px_1fr] justify-start items-center gap-2 h-10">
                                    <span className="text-right">密码:</span>
                                    <div className="px-unit-4 cursor-pointer">
                                        <span className="text-blue-500 dark:text-blue-600" onClick={onOpen}>修改密码</span>
                                    </div>
                                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                        <ModalContent>
                                        {(onClose) => (
                                            <>
                                            <ModalHeader className="flex flex-col gap-1">密码修改</ModalHeader>
                                            <ModalBody>
                                                <Password label="旧密码" value={oldPwd} onValueChange={setOldPwd} />
                                                <Password label="新密码" value={newPwd} onValueChange={setNewPwd} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onPress={onChangePassword} isLoading={loading} disabled={loading}>
                                                    确认
                                                </Button>
                                                <Button color="danger" variant="light" onPress={onCancel} disabled={loading}>
                                                    取消
                                                </Button>
                                            </ModalFooter>
                                            </>
                                        )}
                                        </ModalContent>
                                    </Modal>
                                </div>
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
                    <ShareTable/>
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
