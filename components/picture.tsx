import React, {useEffect, useRef, useState} from "react";
import { IoMdMore } from "react-icons/io";
import {
    Card,
    CardFooter,
    Image,
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
    const descriptionOpen = useDisclosure();
    let [name, setName] = useState(props.name);
    let [link, setShareLink] = useState("");
    let [saveLoading, setSaveLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['none']));
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    const [textColor, setTextColor] = useState('text-black');
    let originName = props.name;

    function generateShareLink(shareMode?: number, password?: string) {
        PictureAPI.sharePicture(props.pid, shareMode, password).then((r) => {
            setShareLink(SERVER_URL + "/picture/share/" + r.sid);
            Message.success("成功分享'" + props.name + "'");
        });
    }

    const deletePicture = (onClose?: () => void) => {
        setDelLoading(true);
        IOC.picture.deletePicture(props.pid)
            .then(() => {
                Message.success('删除成功')
                props.onDelete?.(props.pid);
            })
            .catch((reason) => {
                Message.error(reason)
            })
            .finally(() => {
                onClose?.();
                setDelLoading(false)
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
    useEffect(() => {
        getImgContrast({
            imgSrc: props.url,
        })
            .then((textState) => {
                setTextColor(textState === 'white' ? 'text-white' : 'text-black')
            })
    }, [props.url, setTextColor])
    useEffect(()=>{
        if (deleteConfirmVisible){
            const top = deleteButton.current?.parentElement?.offsetTop ?? 0;
            const height = deleteButton.current?.parentElement?.offsetHeight ?? 0;
            console.log(deleteButton.current)
            const left = (deleteButton.current?.parentElement?.offsetLeft ?? 0) + (deleteButton.current?.offsetLeft ?? 0) - (deleteButton.current?.offsetWidth??0);
            setTop(top - height - 8 - 28);
            setLeft(Math.floor(left));
        }
    }, [deleteConfirmVisible])


    return (
        <div className="flex flex-col mx-auto gap-2 basis-auto items-center cursor-pointer hover:bg-default-500/10 p-2 rounded w-fit group">
            <div className="w-32 max-h-32 relative">
                <div className="p-1 rounded-md absolute top-0 right-0 hidden group-hover:block z-10 bg-default">
                    <IoMdMore className="w-5 h-5 dark:text-white" />
                </div>
                <Image src={props.url} alt={props.name} removeWrapper className="w-full h-full object-contain z-0" />
            </div>
            <p className="text-sm break-all w-full block px-4 text-center">{props.name}</p>
        </div>
    )
}

export type PictureProps = {
    url: string,
    pid: string,
    name: string,
    pubicMode?: string,
    group?: PriceInfo,
    onPress?: () => void,
    onDelete?: (pid: string) => void,
    className?: string
}
