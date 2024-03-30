import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import IOC from "@/providers";
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, ModalBody, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Message } from "./message";
import { IoIosCheckmark } from "react-icons/io";
import { Price } from "./price";
import { prices } from "@/config/prices";
import type {ButtonProps} from '@nextui-org/button';

const shareModeLabel = ['水印', '压缩', '原图']

export const PictureInfo = (props: PictureInfoProps) => {
    const {url, fileName, id} = props;
    const [pictureName, setPictureName] = useState(fileName);
    const [shareMode, setShareMode] = useState(new Set(['0']));
    const [password, setPassword] = useState('');
    const [shareBtnState, setShareBtnState] = useState<'pending' | 'error' | 'success'>('pending')
    const [shareButtonColor, setShareButtonColor] = useState<ButtonProps['color']>('default');
    const [loading, setLoading] = useState(false);
    const [currentMode, setCurrentmode] = useState('水印')
    const pictureInput = useRef(null);

    const share = () => {
        if (!password.length){
            setShareBtnState('error')
            setTimeout(() => {
                setShareBtnState('pending');
            }, 1500);
            return;
        }
        setLoading(true)
        IOC.share.share(password, [`p${props.id}`], Array.from(shareMode)[0])
        .then(()=>{
            setShareBtnState('success')
        })
        .finally(()=>{
            setLoading(false);
        })

    }
    useEffect(()=>{
        setCurrentmode(
            shareModeLabel[
                Number(Array.from(shareMode)[0])
            ]
        )
    }, [shareMode])
    useEffect(()=>{
        if (shareBtnState === 'error'){
            setShareButtonColor('danger');
        }
        if (shareBtnState === 'pending'){
            setShareButtonColor('default');
        }
        if (shareBtnState === 'success'){
            setShareButtonColor('success');
        }
    }, [shareBtnState]);

    const rename = () => {
        if (fileName === pictureName){
            return;
        }
        IOC.picture.changePictureName(pictureName, id)
        .then(()=>{
            Message.success('更名成功');
        })
        .catch(()=>{
            Message.success('更名失败');
            setPictureName(fileName);
        })
    }

    return (
        <div className="flex w-full h-full p-0 gap-6">
            <div className=" basis-60 grow-0 shrink-0 h-full">
                <Image src={url} alt={fileName} removeWrapper className="object-cover h-full w-full"/>
            </div>
            <ModalBody className="flex p-0">
                <div className="flex-auto flex flex-col pr-6">
                    <div className="grow space-y-2 py-8">
                        <div>
                            <Input label={'文件名'} ref={pictureInput} value={pictureName} onValueChange={setPictureName} onBlur={rename} />
                        </div>
                        <div>
                            <Dropdown>
                                <div className="flex gap-2 items-center">
                                    <span>分享:</span>
                                    <DropdownTrigger>
                                        <Button variant="light">
                                            {currentMode}
                                        </Button>
                                    </DropdownTrigger>
                                </div>
                                <DropdownMenu selectionMode="single" selectedKeys={shareMode} onSelectionChange={setShareMode as any}>
                                    <DropdownItem key='0'>水印</DropdownItem>
                                    <DropdownItem key='1'>压缩</DropdownItem>
                                    <DropdownItem key='2'>原图</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        {
                            props.info ? (
                                <div className="space-y-3">
                                    <p>统计信息:</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 grid-flow-col-dense">
                                            <span>文件大小</span>
                                            <span>{props.info.size}</span>
                                        </div>
                                        <div className="grid grid-cols-2 grid-flow-col-dense">
                                            <span>文件大小</span>
                                            <span>{props.info.updateAt}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    <ModalFooter className="p-0 py-2">
                        <Button onClick={props.onClose}>取消</Button>
                        <Popover>
                            <PopoverTrigger>
                                <Button color="primary">确认</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                            {(titleProps) => (
                                <div className="px-1 py-2 w-full">
                                    <p className="text-small font-bold text-foreground" {...titleProps}>
                                        分享密码
                                    </p>
                                    <div className="mt-2 flex flex-col gap-2 w-full">
                                        <Input size="sm" value={password} onValueChange={setPassword} />
                                        <Button color={
                                            shareButtonColor
                                        } onClick={share}>
                                            {
                                                shareBtnState === 'pending' ? '分享文件' : 
                                                    shareBtnState === 'error' ? '密码不能为空' :
                                                        shareBtnState === 'success' ? '分享成功' : '分享文件'
                                            }
                                        </Button>
                                    </div>
                                </div>
                            )}
                            </PopoverContent>
                        </Popover>
                    </ModalFooter>
                </div>
            </ModalBody>
        </div>
    )
}

interface PictureInfoProps {
    url: string;
    fileName: string;
    id: string;
    info?: {
        size: string;
        updateAt: string;
    };
    onClose?: ()=>void
}

