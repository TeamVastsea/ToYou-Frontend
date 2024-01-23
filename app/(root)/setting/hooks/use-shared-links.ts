import {Share} from "@/interface/model/share";
import IOC from "@/providers"
import {useEffect, useState} from "react"
import {LoadingState} from "@react-types/shared";

export const useSharedLinks = () => {
    const [current, setCurrent] = useState<number>(1);
    const [loading, setLoading] = useState<LoadingState>('loading');
    const [list, setList] = useState<Share[]>([]);
    const [page, setPage] = useState<number>(0);
    const caches: Array<Share[]> = [];
    const getSharedPicture = (current: number) => {
        setLoading('loading')
        if (caches[current]) {
            setList(caches[current]);
            return;
        }
        IOC.picture.getAllSharedPicture(10, current)
            .then(({data: {pages, records}}) => {
                setPage(pages);
                setList(records);
                if (caches[current] === undefined) {
                    caches.push([]);
                }
                caches[current].push(...records);
            })
            .catch(() => {
                setLoading('error');
            })
    }
    useEffect(() => {
        getSharedPicture(current);
    }, [current]);
    return {
        current,
        setCurrent,
        loading,
        setLoading,
        page,
        setPage,
        list
    }
}
