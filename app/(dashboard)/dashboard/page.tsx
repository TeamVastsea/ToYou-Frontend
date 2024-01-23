'use client'

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import Fold, { FoldProps } from "./components/Fold";
import { Masonry } from "./components/Masonry";

export default function(){
    const folders = Array.from({length: 100}, (v,k) => k)
    .map((v)=>{
        return {
            label: `fold-${v}`,
            createAt: new Date().getTime()
        }
    }).map((d, idx) => (
        <Fold label={d.label} createAt={d.createAt} key={idx} />
    ))
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full py-7 h-fit basis-auto grow-0 shrink-0 flex items-center">
                <Breadcrumbs className="w-full h-full px-4">
                    <BreadcrumbItem>
                        Images
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="overflow-auto flex flex-wrap w-full px-4">
                {/* {folders} */}
                <div className="w-full">
                    <Masonry />
                </div>
            </div>
        </div>
    )
}