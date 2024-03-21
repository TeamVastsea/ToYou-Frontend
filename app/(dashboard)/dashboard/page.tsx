'use client'

import IOC from "@/providers"
import { useEffect, useMemo, useState } from "react"
import { PictureList } from "./components/picture-list";

export default function Files(){
    const [id, setId] = useState(1);
    useEffect(()=>{
        IOC.fold.getFolderInfo()
        .then((
            {data}
        )=>{
            setId(data.id)
        })
    },[])
    return (
        <div className="px-4">
            <span>files</span>
            <PictureList id={id} />
        </div>
    )
}