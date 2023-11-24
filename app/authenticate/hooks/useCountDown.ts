import { SetStateAction, useEffect, useState } from "react"

export const useCountDown = (
    cd: number
):[string, React.Dispatch<SetStateAction<string>>] => {
    let _cd = cd >= 1000 ? Number((cd/1000).toFixed()) : cd;
    const [time, setTime] = useState('');
    let timer:any = null;
    const dealData = () => {
        if (_cd < 0){
            setTime('');
            return timer && clearTimeout(timer);
        }
        setTime(`${_cd}`)
        _cd --;
        timer = setTimeout(()=>{
            dealData()
        },1000)
    }
    useEffect(()=>{
        dealData();
        return ()=>{
            timer && clearTimeout(timer)
        }
    },[]);
    return [time,setTime]
}