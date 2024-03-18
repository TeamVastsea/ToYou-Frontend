import { UploadProgressItem, uploadStack } from "@/app/store";
import IOC from "@/providers";
import { AxiosProgressEvent } from "axios";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";

export interface UploadProps {
    children: React.ReactNode|React.ReactNode[];
    beforeUpload: (file: File) => boolean | undefined;
    uploadSuccess: (name: string, id: number) => void;
    onProgess: (progress: number) => void;
}

const UploadMask = (
    props: {}
) => {

}

export function Upload(props: Partial<UploadProps>){
    const [maskShow, setShow] = useState(false);
    const setter = useSetAtom(uploadStack);
    const progress = (event: AxiosProgressEvent, name: string)=>{
        const {progress} = event;
        const newItem = {
            label: name,
            value: Number(((progress ?? 0)*100).toFixed(2))
        }
        setter((pre) => [...pre.filter((preAtomValue)=>preAtomValue.label !== name), newItem]);
    }
    const onDrop = (e:React.DragEvent) => {
        setShow(false)
        e.preventDefault()
        const files = e.dataTransfer.files;
        const tasks = [];
        for (const f of files){
            if (!props.beforeUpload || (props.beforeUpload && props.beforeUpload(f))){
                IOC.picture.upload(f, (event)=>progress(event, f.name))
                .then(({data})=>{
                    props.uploadSuccess && props.uploadSuccess(f.name, data)
                })
            }
        }
    }
    const onDragEnter = () => {
        setShow(true)
    }
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation();
    }
    const onDragLeave = (e: React.DragEvent)=>{
        e.preventDefault();
        e.stopPropagation();
        setShow(false);
    }
    useEffect(()=>{
        window.addEventListener('dragenter', onDragEnter);
        return ()=>{
            window.removeEventListener('dragenter', onDragEnter);
        }
    }, [])
    return (
        <div className={
            `w-full h-full absolute top-0 left-0 ${maskShow ? '[&_*]:pointer-events-none' : '[&_*]:pointer-events-auto'}`
        } onDrop={onDrop} onDragLeave={onDragLeave}>
            {
                maskShow ? 
                    <div className="z-10 w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black/30 pointer-events-auto!">
                        <div className="w-fit h-fit flex flex-col items-center justify-center gap-2">
                            <RiUploadCloud2Line className="text-9xl dark:text-white text-default" />
                            <span className="text-4xl dark:text-white text-default-50">
                                松手上传
                            </span>
                        </div>
                    </div> 
                : null
            }
        </div>
    )
}