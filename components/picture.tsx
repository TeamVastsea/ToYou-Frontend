import React, {useState} from "react";
import {Button, Card, CardFooter, Dropdown, DropdownItem, Image, useDisclosure} from "@nextui-org/react";
import copy from "copy-to-clipboard";
import {CheckLinearIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {Message} from "@/components/message";
import {FiCopy, FiShare} from "react-icons/fi";
import {Input} from "@nextui-org/input";
import cookie from "react-cookies";
import {PictureAPI} from "@/interface/pictureAPI";
import {SERVER_URL} from "@/interface/api";
import {PriceInfo} from "@/components/price";

export default function Picture(props: PictureProps) {
    let [isChecked, setIsChecked] = useState(false);
    const descriptionOpen = useDisclosure();
    let [name, setName] = useState(props.name);
    let [shareMode, setShareMode] = useState(props.pubicMode == null ? "none" : props.pubicMode!);
    let timeout: NodeJS.Timeout | null = null;
    let [link, setShareLink] = useState("");

    function generateShareLink(shareMode?: number, password?: string) {
        PictureAPI.sharePicture(props.pid, shareMode, password).then((r) => {
            setShareLink(SERVER_URL + "/picture/share/" + r.sid);
            Message.success("成功分享'" + props.name + "'");
        });
    }

    console.log(cookie.load("token"));

    console.log(props.group?.name! == "professional" || props.group?.name! == "advanced");
    // @ts-ignore
    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center"
                isPressable
                onPress={() => {
                    descriptionOpen.onOpen();
                }}
                style={{width: 450}}
            >
                <Image
                    alt={props.name}
                    className="object-cover"
                    width={450}
                    height={200}
                    src={props.url}
                    isZoomed
                />
                <CardFooter
                    className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-auto shadow-small ml-1 z-10 space-x-2">
                    <p className="text-tiny font-mono">{props.name}</p>&nbsp;
                    <Button isIconOnly className="text-white bg-black/20 justify-center" variant="light" size="sm"
                            onClick={() => {

                                PictureAPI.sharePicture(props.pid).then((r) => {
                                    copy(SERVER_URL + "/picture/share/" + r.sid);
                                    Message.success("已经复制到剪贴板");
                                });

                                setIsChecked(true);

                                if (timeout != null) {
                                    clearTimeout(timeout);
                                    timeout = null;
                                }

                                timeout = setTimeout(() => {
                                    setIsChecked(false);
                                    timeout = null;
                                }, 1000);
                            }}>
                        {isChecked ? <CheckLinearIcon/> : <FiShare/>}
                    </Button>
                </CardFooter>
            </Card>

            <Modal isOpen={descriptionOpen.isOpen} onOpenChange={descriptionOpen.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">图片详情</ModalHeader>
                            <ModalBody>
                                <p>
                                    <Image
                                        alt={props.name}
                                        className="object-cover"
                                        width={450}
                                        height={200}
                                        src={props.url}
                                    />
                                </p>
                                <p>
                                    <Input placeholder={"图片名称"} value={name} onValueChange={setName}/>
                                </p>
                                <p className="flex items-center justify-center space-x-3">
                                    {link == "" ? <Dropdown>
                                        <DropdownTrigger>
                                            <Button className="capitalize">分享</Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={[shareMode!]}
                                            disabledKeys={props.group == undefined ? [] : props.group.disabled}
                                            onAction={(key) => {
                                                let mode = key == "watermark" ? 1 : key == "compressed" ? 2 : 3;
                                                generateShareLink(mode);
                                            }}
                                        >
                                            <DropdownItem key="none">不公开</DropdownItem>
                                            <DropdownItem key="watermark">公开水印版本</DropdownItem>
                                            <DropdownItem key="compressed"
                                                          description={props.group?.name! == "professional" || props.group?.name! == "advanced" || props.group?.name! == "started" ? "" : "仅入门或以上套餐"}>公开压缩版本</DropdownItem>
                                            <DropdownItem key="original"
                                                          description={props.group?.name! == "professional" || props.group?.name! == "advanced" ? "" : "仅进阶或专业套餐"}>公开原图</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown> : <div className="flex" style={{width: 450}}>
                                        <Input className={"font-mono"} variant={"underlined"} value={link} endContent={
                                            <Button isIconOnly className="justify-center"
                                                    variant="bordered" size="sm"
                                                    onClick={() => {
                                                        copy(link);

                                                        setIsChecked(true);

                                                        if (timeout != null) {
                                                            clearTimeout(timeout);
                                                            timeout = null;
                                                        }

                                                        timeout = setTimeout(() => {
                                                            setIsChecked(false);
                                                            timeout = null;
                                                        }, 1000);
                                                    }}>
                                                {isChecked ? <CheckLinearIcon/> : <FiCopy/>}
                                            </Button>
                                        }></Input>

                                    </div>}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    取消
                                </Button>
                                <Button color="primary" onPress={() => {
                                    Message.success("已保存");
                                    onClose();
                                }}>
                                    保存
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export type PictureProps = {
    url: string,
    pid: string,
    name: string,
    pubicMode?: string,
    group?: PriceInfo,
}
