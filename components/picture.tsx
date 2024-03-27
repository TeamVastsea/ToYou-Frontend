import React, {useEffect, useRef, useState} from "react";
import {
    Card,
    CardFooter,
    Image,
    Selection,
    useDisclosure
} from "@nextui-org/react";
import {getImgContrast} from 'react-img-contrast';
import copy from "copy-to-clipboard";
import {CheckLinearIcon, DeleteIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Message} from "@/components/message";
import {FiCopy} from "react-icons/fi";
import {Input} from "@nextui-org/input";
import {PictureAPI} from "@/interface/pictureAPI";
import {SERVER_URL} from "@/interface/api";
import {PriceInfo} from "@/components/price";
import IOC from "@/providers";
import {Button, ButtonGroup} from "@nextui-org/button";

const SharedButton = (props: { link: string, pid?: string, className?: string }) => {
    const {link, pid} = props;
    const [isChecked, setIsChecked] = useState(false);
    let timeout: NodeJS.Timeout | null = null;
    return (
        <Button isIconOnly className="justify-center"
                variant="bordered" size="sm"
                onClick={() => {
                    if (!link && pid) {
                        IOC.share.sharePicture([`p${pid}`])
                        .then(({data})=>{
                            copy(SERVER_URL + "/picture/share/" + data.sid);
                            Message.success("已经复制到剪贴板");
                        })  
                    }
                    if (link) {
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
            {isChecked ? <CheckLinearIcon className={props.className}/> : <FiCopy className={props.className}/>}
        </Button>
    )
}

const cache = new Map<string, string>();

export default function Picture(props: PictureProps) {
    const descriptionOpen = useDisclosure();
    const [url, setURL] = useState('');
    const [name, setName] = useState(props.name);
    const [link, setShareLink] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['none']));
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    const [textColor, setTextColor] = useState('text-black');
    let originName = props.name;

    function generateShareLink(shareMode?: number, password?: string) {
        IOC.share.sharePicture([props.id], shareMode, password)
        .then(({data})=>{
            setShareLink(SERVER_URL + "/picture/share/" + data.sid);
            Message.success("成功分享'" + props.name + "'");
        })

    }

    const deletePicture = (onClose?: () => void) => {
        setDelLoading(true);
        IOC.picture.deletePicture(props.id)
            .then(() => {
                Message.success('删除成功')
                props.onDelete?.(props.id);
            })
            .catch((reason) => {
                Message.error(reason)
            })
            .finally(() => {
                onClose?.();
                setDelLoading(false);
                setDeleteConfirmVisible(false);
            })
    }

    const deleteButton = useRef<HTMLButtonElement>(null);

    useEffect(()=>{
        const closeDeleteConfirm = ()=>{
            console.log('click')
            setDeleteConfirmVisible(false)
        }
        window.addEventListener('mousedown', closeDeleteConfirm)
        return () => {
            window.removeEventListener('mousedown', closeDeleteConfirm);
        }
    })
    useEffect(()=>{
        if (!cache.has(props.id)){
            IOC.picture.getPicture(props.id, props.token)
            .then((url)=>{
                setURL(url);
                cache.set(props.id, url);
            })
        } else {
            setURL(cache.get(props.id)!)
        }
    },[props.id, props.token]);
    useEffect(() => {
        getImgContrast({
            imgSrc: url,
        })
            .then((textState) => {
                setTextColor(textState === 'white' ? 'text-white' : 'text-black')
            })
    }, [url, setTextColor])
    useEffect(()=>{
        if (deleteConfirmVisible){
            const top = deleteButton.current?.parentElement?.offsetTop ?? 0;
            const height = deleteButton.current?.parentElement?.offsetHeight ?? 0;
            const left = (deleteButton.current?.parentElement?.offsetLeft ?? 0) + (deleteButton.current?.offsetLeft ?? 0) - (deleteButton.current?.offsetWidth??0);
            setTop(top - height - 8 - 28);
            setLeft(Math.floor(left));
        }
    }, [deleteConfirmVisible])


    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center relative w-full h-full min-h-[200px]"
                isPressable
                onPress={()=>{descriptionOpen.onOpen(); setDeleteConfirmVisible(false)}}
            >
                <Image
                    alt={props.name}
                    className="object-cover h-full"
                    // width={450}
                    src={url}
                    isZoomed
                    removeWrapper
                />
                {
                    deleteConfirmVisible && (
                        <div className="absolute p-2 z-30 rounded-md bg-default-50 right-0.5" style={{
                            top: `${top}px`,
                        }}>
                            <h3 className="text-base mb-2">确定要删除吗</h3>
                            <Button color="danger" size="sm" fullWidth onClick={() => {deletePicture();}}>
                                确认
                            </Button>
                        </div>
                    )
                }
                <CardFooter
                    className={
                        `
                        w-auto max-w-[75%] justify-between
                        before:bg-white/10 before:rounded-xl
                        border-white/20 overflow-hidden py-2 absolute rounded-large bottom-1 shadow-small ml-1 z-10 space-x-2
                        ${textColor}
                        `
                    }
                >
                    <p className={`text-tiny font-mono truncate ${textColor}`} title={name}>{name}</p>&nbsp;
                    <SharedButton link={link} pid={props.id} className={
                        `${textColor}`
                    }/>
                    <Button isIconOnly className="justify-center" variant="bordered" size="sm"
                            isLoading={delLoading} onClick={() => setDeleteConfirmVisible(!deleteConfirmVisible)}
                            ref={deleteButton}
                        >
                        {!delLoading && <DeleteIcon className={`${textColor}`}/>}
                    </Button>
                </CardFooter>                
            </Card>

            <Modal isOpen={descriptionOpen.isOpen} onOpenChange={descriptionOpen.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">图片详情</ModalHeader>
                            <ModalBody>
                                <div className="w-fit mx-auto">
                                    <Image
                                        alt={props.name}
                                        className="object-cover mx-auto"
                                        width={200}
                                        height={200}
                                        src={url}
                                    />
                                </div>
                                <p>
                                    <Input placeholder={"图片名称"} value={name} onValueChange={setName}/>
                                </p>
                                <p className="flex items-center justify-center">
                                    {link == "" ?
                                        <ButtonGroup>
                                            <Button variant={"flat"} color={"secondary"} onClick={() => {
                                                generateShareLink(1)
                                            }}>分享水印图片</Button>
                                            <Button
                                                variant={props.group?.disabled.includes("compressed") ? "solid" : "flat"}
                                                color={props.group?.disabled.includes("compressed") ? "default" : "secondary"}
                                                disabled={props.group?.disabled.includes("compressed")}
                                                onClick={() => {
                                                    generateShareLink(2)
                                                }}>分享压缩图片</Button>
                                            <Button
                                                variant={props.group?.disabled.includes("original") ? "solid" : "flat"}
                                                color={props.group?.disabled.includes("original") ? "default" : "secondary"}
                                                disabled={props.group?.disabled.includes("original")}
                                                onClick={() => {
                                                    generateShareLink(3)
                                                }}>分享原图</Button>
                                        </ButtonGroup>
                                        : <div className="flex space-x-3" style={{width: 450}}>
                                            <Input className={"font-mono"} variant={"underlined"} value={link}
                                                   endContent={
                                                       <SharedButton link={link}/>
                                                   }></Input>
                                        </div>}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button isLoading={saveLoading} color="primary" onPress={() => {
                                    setSaveLoading(true);
                                    PictureAPI.changePictureName(name, props.id).then(() => {
                                        Message.success("已保存");
                                        originName = name;
                                        setSaveLoading(false);
                                        onClose();
                                    });
                                }}>
                                    保存
                                </Button>
                                <Button disabled={saveLoading} color="danger" variant={"light"} onPress={() => {
                                    setName(originName);
                                    onClose();
                                }}>
                                    取消
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
    id: string,
    name: string,
    pubicMode?: string,
    token: string;
    group?: PriceInfo,
    onPress?: () => void,
    onDelete?: (pid: string) => void,
}
