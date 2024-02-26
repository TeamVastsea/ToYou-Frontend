'use client'

import cookie from 'react-cookies'
import Picture from "@/components/picture";
import { SERVER_URL } from "@/interface/api";
import { Picture as IPicture } from "@/interface/model/picture";
import IOC from "@/providers";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { useMemo, useState } from "react";
// import Fold, { FoldProps } from "./components/Fold";
// import { Masonry } from "./components/Masonry";

export default function Dashboard(){
    const [pictures, setPictures] = useState<IPicture[]>([]);
    useMemo(()=>{
        IOC.picture.getList()
        .then(({data})=>{
            setPictures(data.records)
            console.log(data)
        })
    },[])
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full py-7 h-fit basis-auto grow-0 shrink-0 flex items-center">
                <Breadcrumbs className="w-full h-full px-4">
                    <BreadcrumbItem>
                        Images
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="overflow-auto flex flex-wrap w-full h-full px-4 py-2">
                <div className="w-full h-fit grid justify-center grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-4">    
                    {
                        pictures?.map((p, idx) => {
                            return (
                                
                                <Picture
                                    key={idx}
                                    url={`${SERVER_URL}/picture/preview?shareMode=2&id=${p.id}&token=${cookie.load('token')}`}
                                    pid={p.pid}
                                    name={p.fileName}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}