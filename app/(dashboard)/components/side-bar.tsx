'use client'

import { uploadStack } from "@/app/store";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem} from '@nextui-org/react'
import { IconType } from "react-icons";
import { FaImage, FaFolder } from "react-icons/fa";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { UploadProgress } from "./upload-progress";
import UserGroup from "./user-group";

export interface SideBarItem {
    href: string;
    icon: IconType;
    label: string;
}


const sideBar:SideBarItem[] = [
    {
        label: '图片',
        icon: FaImage,
        href: '/dashboard/images'
    },
    {
        label: '项目',
        icon: FaFolder,
        href: '/dashboard'
    }
]


export function SideBar(){
    const pathName = usePathname();
    const items = sideBar?.map((item, idx) => {
        return (
            <Link key={idx} href={item.href} className={`rounded-md ${pathName === item.href && 'bg-default-50'}`}>
                <div className="flex gap-2 mx-auto w-fit py-2">
                    {item.icon({size:24, className: 'w-6 h-6 text-default-900 flex-shrink-0'})}
                    <span className="text-base">{item.label}</span>
                </div>
            </Link>
        )
    })
    const [tasks] = useAtom(uploadStack);

    return (
        <aside className="flex flex-col justify-between w-[120px] h-full bg-default-100 px-2 py-5 shrink-0">
            <div className="flex flex-col gap-5">
                {items}
            </div>
            <div className="flex flex-col gap-8 items-center w-full justify-center relative">
                {
                    tasks.length ? <Popover placement="right-end" title="上传进度">
                        <PopoverTrigger>
                            <div>
                                <HiOutlineArrowsUpDown size={22} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            {(titleProps) => (
                                <div className="px-1 py-2">
                                    <h3 className="text-small font-bold" {...titleProps}>
                                        上传进度
                                    </h3>
                                    <UploadProgress />
                                </div>
                            )}
                        </PopoverContent>
                    </Popover> : null
                }
                <ThemeSwitch />
                <UserGroup />
            </div>
        </aside>
    )
}