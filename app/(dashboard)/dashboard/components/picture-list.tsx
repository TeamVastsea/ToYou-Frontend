import Picture from '@/components/picture';
import {Picture as IPicture} from '@/interface/model/picture';
import IOC from '@/providers';
import { useDebounce, useInViewport } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import cookie from 'react-cookies'
export function PictureList(props: PictureListProps){
    const {id=1,page=0, size=20, external=[], autoLoad=true} = props;
    const [pictures, setPictues] = useState<IPicture[]>([])
    const [_external,setExternal] = useState<{file_name:string,id:number}[]>([])
    const [_page, setPage] = useState(page);
    const [canLoad,setCanLoad] = useState(false);
    const [finish,setFinish] = useState(false);
    const obEle = useRef(null);
    useMemo(()=>{
        setCanLoad(false);
        IOC.picture.getList(id)
        .then(({data})=>{
            if (!data.records.length){
                setPictues([]);
                setCanLoad(false);
                return;
            }
            setPictues((old)=>[...old, ...data.records]);
            setCanLoad(true)
        })
    },[id])
    useMemo(()=>{
        if (_page !== 0){
            IOC.picture.getList(id, _page, size)
            .then(({data})=>{
                if (data.pages === _page){
                    setFinish(true);
                }
                setPictues((old)=>[...old, ...data.records]);
            })
            .finally(()=>{
                setCanLoad(true);
            })
        }
    }, [_page,size])
    const loadMoreFn = useDebounce(()=>{
        if (finish){
            return;
        }
        if (autoLoad && canLoad){
            setPage(_page+1);
            return;
        }
        props.inBottom && props.inBottom(_page);
    }, {wait: 500})
    const onDelete = (id: number) => {

    }
    useInViewport(obEle,{
        callback: loadMoreFn,
        threshold: 1,
    })
    return (
        <>
            <div className='w-full h-fit grid justify-center grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-4'>
                {
                    external.map(({file_name,id},idx)=>{
                        return (
                        <Picture 
                            key={idx}
                            id={id.toString()}
                            name={file_name}
                            token={cookie.load('token')}
                            onDelete={(id) => external.filter((e) => e.id !== Number(id))}
                        />)
                    })
                }
                {
                    pictures.map(({id,file_name},idx) => {
                        return (
                        <Picture 
                            key={idx}
                            id={id.toString()}
                            name={file_name}
                            token={cookie.load('token')}
                            onDelete={
                                (id) => pictures.filter((p)=>p.id !== Number(id))
                            }
                        />)
                    })
                }
            </div>
            <div className='w-full h-2 py-4' ref={obEle}></div>
        </>
    )
}

interface PictureListProps {
    id: number;
    page?: number;
    size?: number;
    external?: {file_name: string, id: number}[];
    autoLoad?: boolean;
    inBottom?: (currentPage:number) => void
}