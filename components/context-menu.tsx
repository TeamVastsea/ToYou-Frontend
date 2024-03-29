import {
    Popover,
    PopoverContent,
    Listbox,
    ListboxItem,
} from '@nextui-org/react';
import React, { EventHandler, forwardRef, useEffect, useRef, useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
export interface ContextMenuItemData {
    id? :string;
    name: string;
    fn?: ()=>any | Promise<any>;
    type?: "default" | "danger" | "primary" | "secondary" | "success" | "warning"
}
interface ContextMenuProps {
    data: ContextMenuItemData[];
    children: React.ReactNode
}

export function ContextMenuItems(props: {data: ContextMenuItemData[], onClick: (loading: (string|number)[])=>void}) {
    const [loading, setLoading] = useState<(string|number)[]>([]);
    const onItemClick = (id: string|number, fn?: ()=>any | Promise<any>) => {
        setLoading([...loading, id]);
        const p = fn?.();
        if (p ===  undefined){
            // 如果没有任何返回, 则自动关闭
            props.onClick(loading)
            setLoading(
                loading.filter((v) => v !== id)
            )
        }
        if (p instanceof Promise){
            p
            .then((state)=>{
                if (state){
                    props.onClick(loading);
                }
            })
            .catch(()=>{
                props.onClick(loading);
            })
            .finally(()=>{
                setLoading(
                    loading.filter((v) => v !== id)
                )
            })
        } else {
            const close = p;
            if (close){
                props.onClick(loading);
            }
            setLoading(
                loading.filter((v) => v !== id)
            )
        }
    }
    useEffect(()=>{
        return () => {
            setLoading([]);
        }
    }, []);
    return (
        <Listbox aria-label="Context menu" disabledKeys={loading}>
            {
                props.data.map((item, idx)=>{
                    return (
                        <ListboxItem
                            aria-label={item.name}
                            key={item.id ?? idx}
                            onClick={()=>onItemClick(item.id ?? idx, item.fn)}
                            color={item.type ?? 'default'}
                            startContent={
                                loading.includes(item.id ?? idx) ? <AiOutlineLoading className='animate-spin' /> : null
                            }
                            
                        >
                            {item.name}
                        </ListboxItem>
                    )
                })
            }
        </Listbox>
    )
}

export function ContextMenu(props: ContextMenuProps) {
    const [visible, setVisible] = useState(false);
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setVisible(!visible);
    }
    const menuItemsOnClick = (loading: (string|number)[]) => {
        setVisible(false);
    }
    const trigger = useRef(null);
    return (
        <Popover placement='bottom' isOpen={visible} onOpenChange={(isOpen: boolean) => setVisible(isOpen)} triggerType='menu' triggerRef={trigger}>
            <div onClick={onContextMenu} ref={trigger} className='cursor-pointer'>
                {props.children}
            </div>
            <PopoverContent onClick={()=>setVisible(false)}>
                <ContextMenuItems data={props.data} onClick={menuItemsOnClick} />
            </PopoverContent>
        </Popover>
    )
}