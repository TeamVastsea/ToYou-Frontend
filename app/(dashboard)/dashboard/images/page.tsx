'use client'
import { useMemo, useState } from "react";
import type {Picture as IPicture} from '@/interface/model/picture';
import IOC from "@/providers";
import Picture from "@/components/picture";
import { Upload } from "@/components/upload";
import cookie from 'react-cookies'

export default function Pages(){
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
        <>
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
        </>
    )
}