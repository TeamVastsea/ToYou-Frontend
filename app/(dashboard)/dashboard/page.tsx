'use client'

import cookie from 'react-cookies'
import Picture from "@/components/picture";
import { SERVER_URL } from "@/interface/api";
import { Picture as IPicture } from "@/interface/model/picture";
import IOC from "@/providers";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { Upload } from '@/components/upload';
import { useDebounce } from 'ahooks';

export default function Dashboard(){
    const [pictures, setPictures] = useState<IPicture[]>([]);
    const [currentDir, setCurrentDir] = useState(0);
    useMemo(()=>{
        IOC.picture.getList()
        .then(({data})=>{
            setPictures(data.records)
        })
    },[])
    const onUploadSuccess = (name: string, id: number)=>{
        setPictures([{file_name: name, id} as IPicture, ...pictures])
    }
    return (
        <div className='relative'>
            <div className="w-full h-full flex flex-col relative">
                <div className="w-full py-7 h-fit basis-auto grow-0 shrink-0 flex items-center">
                    <Breadcrumbs className="w-full h-full px-4">
                        <BreadcrumbItem>
                            Images
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <Upload uploadSuccess={onUploadSuccess} />
                <div className="overflow-auto flex flex-wrap w-full h-full px-4 py-2">
                    <div className="w-full h-fit grid justify-center grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-4">    
                        {
                            pictures?.map((p, idx) => {
                                return (
                                    
                                    <Picture
                                        key={idx}
                                        id={`${p.id}`}
                                        name={p.file_name}
                                        token={cookie.load('token')}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}