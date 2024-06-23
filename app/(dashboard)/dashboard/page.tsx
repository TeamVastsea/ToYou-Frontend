'use client'

import { FaPlus } from "react-icons/fa6";
import IOC from "@/providers"
import { useEffect, useMemo, useState } from "react"
import { PictureList } from "./components/picture-list";
import { Folder } from "./components/folder";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentFolderId, folderId, profile } from "@/app/store";
import { Fold as IFold } from "@/providers/folder";
import { AxiosResponse } from "axios";
import { Upload } from "@/components/upload";
import { Message } from "@/components/message";
import { UserAPI } from "@/interface/userAPI";

const foldCache = new Map<string, IFold>();
const cache = new Map<string, string[]>();

export default function Files(){
    const [id, setId] = useAtom(currentFolderId)
    const setFoldIdStack = useSetAtom(folderId);
    const [folderInfo, setFolderInfo] = useState<IFold[]>([])
    const [children, setChildren] = useState<string[]>([])
    const [,setProfile] = useAtom(profile);
    useEffect(()=>{
        if (cache.has(id)){
            setChildren(cache.get(id)!);
            return;
        } else {
            IOC.fold.getFolderInfo(id)
            .then(({data})=>{
                if (!data.child){
                    setChildren([]);
                    return;
                }
                const children = data.child.map((child) => child.toString());
                setChildren(children);
                cache.set(id, children);
            })
        }
    }, [id])
    useEffect(()=>{
        UserAPI.getExtendedInformation()
        .then((val) => val ? setProfile(val) : null)
    }, [])
    useEffect(()=>{
        const folderInfo = [];
        const promiseStack = [];
        for (const child of children){
            if (foldCache.get(child)){
                folderInfo.push(foldCache.get(child)!);
                continue;
            }
            promiseStack.push(IOC.fold.getFolderInfo(child));
        }
        Promise.allSettled(promiseStack)
        .then((res)=>res.map((r) => r.status === 'fulfilled' ? r.value.data : null))
        .then((res) => {
            return res.filter((r) => r !== null) as IFold[];
        })
        .then((res)=>{
            setFolderInfo(res);
        })
        .catch(()=>{})
    }, [children])
    const onClickFold = (id?: string, name?: string) => {
        if(!id||!name){return;}
        setId(id);
        setFoldIdStack((old)=>{
            return [
                ...old.filter((cur) => cur.id !== id),
                {id,name}
            ]
        })
    }
    return (
        <>
            <Upload />
            <div className="px-4">
                <div className="grid justify-center grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-4">
                    {
                        folderInfo.map(({id,name}, idx)=>{
                            return (
                                <Folder name={name} id={id} key={idx} onClick={onClickFold} />
                            )
                        })
                    }
                </div>
                <PictureList id={Number(id)} />
            </div>
        </>
    )
}