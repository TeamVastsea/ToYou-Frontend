import React, {Key, useEffect, useMemo, useRef, useState} from "react";
import { IoMdMore } from "react-icons/io";
import {
    Card,
    CardFooter,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
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
import { ContextMenu, ContextMenuItemData } from "./context-menu";
import { useAtomValue } from "jotai";
import { profile } from "@/app/store";
import { getDisabledById } from "@/config/prices";
import { string } from "zod";

const SharedButton = (props: { link: string, pid?: string, className?: string }) => {
    const {link, pid} = props;
    const [isChecked, setIsChecked] = useState(false);
    let timeout: NodeJS.Timeout | null = null;
    return (
        <Button isIconOnly className="justify-center"
                variant="bordered" size="sm"
                onClick={() => {
                    if (!link && pid) {
                        PictureAPI.sharePicture(pid).then((r) => {
                            copy(SERVER_URL + "/picture/share/" + r.sid);
                            Message.success("已经复制到剪贴板");
                        });
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



export default function Picture(props: PictureProps) {
    const [url, setUrl] = useState<string>('');
    const [sharedMode, setSharedMode] = useState(ShareMode.WATERMARK);
    const [password, setPassword] = useState('');
    const userInfo = useAtomValue(profile)
    const {level:{level}} = userInfo ?? {level: {level: 'Free'}}
    const [disabledKeys, setDisabledKeys] = useState(getDisabledById(level).map((id) => ShareMode[id as any] as unknown as number));
    const [loading, setLoading] = useState(false);
    const [sharedUrl, setSharedUrl] = useState('');
    const [showSharedUrlVisibility, setShowSharedUrlModalVisibility] = useState(false)
    const share = (key: Selection, onClose: ()=>void) => {
        const sharedMode = Number(Array.from((key as Set<Key>).values())[0])
        setLoading(true);
        setSharedMode(sharedMode);
        IOC.picture.sharePicture(props.id, sharedMode, password)
        .then(({data})=>{
            setSharedUrl(`${SERVER_URL}/picture/share/${data.sid}`)
            setShowSharedUrlModalVisibility(true)
        })
        .finally(()=>{
            onClose();
            setLoading(false);
        })
    }
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const contextMenu:ContextMenuItemData[] = [
        {
            id: 'delete',
            name: '删除',
            type: 'danger',
            fn(){
                return IOC.picture.deletePicture(props.id)
            }
        },
        {
            id: 'share',
            name: '分享',
            type: 'default',
            fn() {
                onOpen();
            },
        }
    ]
    useMemo(()=>{
        IOC.picture.getPicture(props.id, props.token)
        .then(url => setUrl(url))
    }, [props.id, props.token])

    return (
        <div className="flex flex-col mx-auto gap-2 basis-auto items-center cursor-pointer hover:bg-default-500/10 p-2 rounded w-fit group">
            <div className="w-32 max-h-32 relative">
                <div className="p-1 rounded-md absolute top-0 right-0 hidden group-hover:block z-10 bg-default">
                    <ContextMenu data={contextMenu}>
                        <IoMdMore className="w-5 h-5 dark:text-white" />
                    </ContextMenu>
                </div>
                <Image src={url} alt={props.name} removeWrapper className="w-full h-full object-cover z-0 min-h-unit-24" />
            </div>
            <p className="text-sm break-all w-full block px-4 text-center">{props.name}</p>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">图片分享</ModalHeader>
                        <ModalBody>
                            <Image src={url} alt={props.name} removeWrapper className="w-full h-unit-24 object-contain z-0" />
                            <Input 
                                required
                                value={password}
                                onValueChange={setPassword}
                                placeholder="访问密码"
                                isRequired
                                errorMessage={!password.length ? '密码不能为空' : ''}
                                isInvalid={!password.length}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button color="primary" isLoading={loading}>
                                        Action
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu 
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={sharedMode as any}
                                    onSelectionChange={(key)=>share(key, onClose)}
                                    disabledKeys={disabledKeys.map((v) => v.toString())}
                                >
                                    <DropdownItem key={ShareMode.WATERMARK}>水印</DropdownItem>
                                    <DropdownItem key={ShareMode.COMPRESSED}>压缩</DropdownItem>
                                    <DropdownItem key={ShareMode.ORIGINAL}>原图</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            <Modal isOpen={showSharedUrlVisibility}>
                <ModalContent>
                    <Input isReadOnly={true} value={sharedUrl} />
                    <Button onPress={()=>setShowSharedUrlModalVisibility(false)}>
                        复制分享链接
                    </Button>
                </ModalContent>
            </Modal>
        </div>
    )
}
export enum ShareMode {
    /**
     * 水印
     */
    WATERMARK,
    /**
     * 压缩
     */
    COMPRESSED,
    /**
     * 原图
     */
    ORIGINAL
};
export type PictureProps = {
    id: string,
    name: string,
    pubicMode?: string,
    group?: PriceInfo,
    onPress?: () => void,
    onDelete?: (pid: string) => void,
    className?: string;
    token: string;
}
