'use client'
import { useMemo, useState } from "react";
import type {Picture as IPicture} from '@/interface/model/picture';
import IOC from "@/providers";
import Picture from "@/components/picture";
import { Upload } from "@/components/upload";
import cookie from 'react-cookies'
import { PictureList } from "../components/picture-list";

export default function Pages(){
    const [externalPicture, setExternalPicture] = useState<{file_name: string, id:number}[]>([]);

    const onUploadSuccess = (name: string, id: number)=>{
        setExternalPicture((p)=>[{file_name:name,id},...p]);
    }
    return (
        <>
            <Upload uploadSuccess={onUploadSuccess} />
            <div className="overflow-auto flex flex-wrap w-full h-full px-4 py-2">
                <PictureList id={1} page={0} size={20} external={externalPicture} />
            </div>
        </>
    )
}