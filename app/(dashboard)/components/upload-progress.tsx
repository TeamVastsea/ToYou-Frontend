import { uploadStack } from '@/app/store';
import {Listbox, ListboxItem} from '@nextui-org/react';
import { useAtomValue, useSetAtom } from 'jotai';
export function UploadProgress(){
    const tasks = useAtomValue(uploadStack)
    const setter = useSetAtom(uploadStack)
    return (
        <Listbox className='px-0 my-2'>
            {
                ...tasks.map(({label, value},idx)=>{
                    return (
                        <ListboxItem key={idx} onClick={
                            ()=>setter((pre) => {
                                return pre.filter((item) => item.label !== label)
                            })
                        }>
                            {label} - {value}%
                        </ListboxItem>
                    )
                })
            }
        </Listbox>
    )
}