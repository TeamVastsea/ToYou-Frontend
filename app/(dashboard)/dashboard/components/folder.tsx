import { ContextMenu, ContextMenuItemData } from "@/components/context-menu";
import { Message } from "@/components/message";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import IOC from "@/providers";
import { Input } from "@nextui-org/input";
import { useRef, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
export function Folder(props: Partial<FolderProps>){
    const [name, setName] = useState(props.name);
    const [isRename, setRenameState] = useState(false)
    const contextMenu:ContextMenuItemData[] = [
        {
            id: 'rename',
            name: '重命名',
            type: 'default',
            fn() {
                setRenameState(true)
            },
        }
    ]
    const foldInstance = useRef(null);
    useOnClickOutside(foldInstance, ()=>{
        if (props.id === undefined || !name?.length){
            setName(props.name);
            setRenameState(false);
            return;
        }
        if (isRename){
            IOC.fold.rename(props.id.toString(), name)
            .then(()=>{
                Message.success('修改成功')
            })
            .catch(()=>{
                Message.error('修改失败')
            })
            .finally(()=>{
                setRenameState(false);
            })
        }
    })
    return (
        <div
            className="rounded hover:bg-default-500/10 py-4 transition-all cursor-pointer group"
            onClick={() => props.onClick?.(props.id?.toString(), props.name)}
            ref={foldInstance}
        >
            <div className="w-full px-2 flex flex-col justify-center items-center relative">
                <div className="bg-default rounded-md p-1 absolute top-0 right-3 hidden group-hover:block">
                    <ContextMenu data={contextMenu}>
                        <IoMdMore className="w-5 h-5 dark:text-white" />
                    </ContextMenu>
                </div>
                <FaFolder size={114} />
                <div className="max-w-full break-words text-center">
                    {
                        isRename ? <Input value={name} onValueChange={setName} /> : <span>{name}</span>
                    }
                </div>
            </div>
        </div>
    )
}

export interface FolderProps {
    name: string;
    id: number;
    onClick: (id?: string, name?:string)=>void
}