'use client'

import { ThemeSwitch } from "@/components/theme-switch";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { FaImage, FaFolder } from "react-icons/fa";

export interface SideBarItem {
    href: string;
    icon: IconType;
    label: string;
}


const sideBar:SideBarItem[] = [
    {
        label: '图片',
        icon: FaImage,
        href: '/dashboard'
    },
    {
        label: '项目',
        icon: FaFolder,
        href: '/dashboard/project'
    }
]


export function SideBar(){
    const items = sideBar?.map((item, idx) => {
        return (
            <Link key={idx} href={item.href} className={`rounded-md ${usePathname() === item.href && 'bg-default-50'}`}>
                <div className="flex gap-2 mx-auto w-fit py-2">
                    {item.icon({size:24, className: 'w-6 h-6 text-default-900 flex-shrink-0'})}
                    <span className="text-base">{item.label}</span>
                </div>
            </Link>
        )
    })
    return (
        <aside className="flex flex-col justify-between w-[120px] h-full bg-default-100 px-2 py-5 shrink-0">
            <div className="flex flex-col gap-5">
                {items}
            </div>
            <div className="flex w-full justify-center">
                <ThemeSwitch />
            </div>
        </aside>
    )
}