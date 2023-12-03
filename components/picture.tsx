import React, {useMemo, useState} from "react";
import {
    Selection,
    Button,
    Card,
    CardFooter,
    Image,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure
} from "@nextui-org/react";
import copy from "copy-to-clipboard";
import {CheckLinearIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Message} from "@/components/message";
import {FiCopy, FiShare} from "react-icons/fi";
import {Input} from "@nextui-org/input";
import {PictureAPI} from "@/interface/pictureAPI";
import {SERVER_URL} from "@/interface/api";
import {PriceInfo} from "@/components/price";

const SharedButton = (props: {link: string, pid?:string}) => {
    const {link, pid} = props;
    const [isChecked, setIsChecked] = useState(false);
    let timeout: NodeJS.Timeout | null = null;
    return (
        <Button isIconOnly className="justify-center"
            variant="bordered" size="sm"
            onClick={() => {
                if (pid){
                    PictureAPI.sharePicture(pid).then((r) => {
                        copy(SERVER_URL + "/picture/share/" + r.sid);
                        Message.success("已经复制到剪贴板");
                    });
                }
                if (link){
                    copy(link);
                }
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
    )
}

export default function Picture(props: PictureProps) {
    const descriptionOpen = useDisclosure();
    let [name, setName] = useState(props.name);
    let [link, setShareLink] = useState("");
    let [saveLoading, setSaveLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['none']));
    function generateShareLink(shareMode?: number, password?: string) {
        PictureAPI.sharePicture(props.pid, shareMode, password).then((r) => {
            setShareLink(SERVER_URL + "/picture/share/" + r.sid);
            Message.success("成功分享'" + props.name + "'");
        });
    }
    useMemo(()=>{
        const key = Array.from(selectedKeys).join('');
        let mode = key == "watermark" ? 1 : key == "compressed" ? 2 : 3;
        generateShareLink(mode);
    }, [selectedKeys])
    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center"
                isPressable
                onPress={descriptionOpen.onOpen}
                style={{maxWidth: 450, width: '100%'}}
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
                    <SharedButton link={link} pid={props.pid} />
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
                                    {link == "" ? <Popover>
                                        <PopoverTrigger>
                                            <Button className="capitalize">分享</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Listbox
                                                disallowEmptySelection
                                                selectionMode="single"
                                                selectedKeys={selectedKeys}
                                                onSelectionChange={setSelectedKeys}
                                                disabledKeys={props.group == undefined ? [] : props.group.disabled}
                                            >
                                                <ListboxItem key="none">不公开</ListboxItem>
                                                <ListboxItem key="watermark">公开水印版本</ListboxItem>
                                                <ListboxItem key="compressed"
                                                            description={props.group?.name! == "professional" || props.group?.name! == "advanced" || props.group?.name! == "started" ? "" : "仅入门或以上套餐"}>公开压缩版本</ListboxItem>
                                                <ListboxItem key="original"
                                                            description={props.group?.name! == "professional" || props.group?.name! == "advanced" ? "" : "仅进阶或专业套餐"}>公开原图</ListboxItem>
                                            </Listbox>
                                        </PopoverContent>
                                    </Popover> : <div className="flex" style={{width: 450}}>
                                        <Input className={"font-mono"} variant={"underlined"} value={link} endContent={
                                            <SharedButton link={link} />
                                        }></Input>

                                    </div>}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button disabled={saveLoading} color="danger" variant="light" onPress={onClose}>
                                    取消
                                </Button>
                                <Button isLoading={saveLoading} color="primary" onPress={() => {
                                    setSaveLoading(true);
                                    PictureAPI.changePictureName(name, props.pid).then(() => {
                                        Message.success("已保存");
                                        setSaveLoading(false);
                                        onClose();
                                    });
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
    onPress?: ()=>void
}
