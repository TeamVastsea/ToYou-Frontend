'use client'
import { 
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react"
import { SideBar } from "./components/side-bar"
import {useOnClickOutside} from '@/hooks/useOnClickOutside';
import { FaPlus,FaFolder} from "react-icons/fa"
import React, { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue } from "jotai";
import { currentFolderId, folderId } from "../store";
import IOC from "@/providers";
import { Message } from "@/components/message";
import { usePathname } from "next/navigation";
import { ToastProvider } from "../providers";
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
}){
    const [show, setShow] = useState(false);
    const [folderName,setName] = useState('新建文件夹');
    const [loading,setLoading] = useState(false);
    const [id, setId] = useAtom(currentFolderId);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const r = useRef(null);
    const [ids, setIds] = useAtom(folderId)
    const pathName = usePathname()
    useOnClickOutside(r, ()=>setShow(false));
    const createFolder = () => {
        setLoading(true);
        IOC.fold.create(Number(id), folderName)
        .then(()=>{
            onOpenChange()
        })
        .catch((reason)=>{
            Message.error(reason);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    const onAction = (key: React.Key) => {
        setId(key.toString());
        setIds((oldId) => {
            const idx = oldId.findIndex((item) => item.id === key.toString());
            if (idx === -1 || idx === 0){
                return [{id:'1',name: 'root'}];
            }
            return oldId.slice(0,idx+1)
        })
    }
    return (
        <section className="
        flex min-w-0 h-full w-full max-w-full
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        xl:max-w-6xl xl:h-[calc(100vh_-_40px)]
            ">
                <section className="w-full flex bg-default-50 overflow-hidden xl:rounded-3xl">
                    <SideBar />
                    <section className="flex-auto h-full overflow-auto">
                        <div className="relative">
                            <div className="w-full h-full flex flex-col relative">
                                <div className="w-full py-7 h-fit basis-auto grow-0 shrink-0 flex items-center z-10">
                                    <Breadcrumbs className="w-full h-full px-4" onAction={onAction}>
                                        {
                                            pathName.includes('images') ? <BreadcrumbItem>Images</BreadcrumbItem> :
                                            ids.map(({id, name})=>{
                                                return <BreadcrumbItem key={id}>{name}</BreadcrumbItem>
                                            })
                                        }
                                    </Breadcrumbs>
                                </div>
                                {children}
                            </div>
                        </div>
                    </section>
                </section>
                <div className="z-10 absolute bottom-16 right-16 cursor-pointer" ref={r}>
                    {
                        show && (
                        <div
                            className="p-4 bg-default absolute left-1/2 bottom-full -translate-x-1/2 mb-4 rounded-full"
                            onClick={()=>{
                                onOpen();
                                setShow(false)
                            }}
                        >
                            <FaFolder size={24}  />
                        </div>
                        )
                    }
                    <div 
                        className="bg-primary p-4 rounded-full"
                        onClick={()=>{
                            setShow(show === true ? false : true);
                        }}
                    >
                        <FaPlus size={24}/>
                    </div>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        <ModalHeader>
                            新建目录
                        </ModalHeader>
                        <ModalBody>
                            <Input label="目录名称" onValueChange={setName} value={folderName} />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onOpenChange}>取消</Button>
                            <Button color="primary" onClick={createFolder} isLoading={loading}>确认</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </section>
    )
}