'use client'

import { useEffect, useState } from "react";
import { useCountDown } from "../hooks";
import IOC from "@/providers";
import { Button } from "@nextui-org/react";
import CountDown from "./count-down";

const CheckCode = (props: {type: 'email' | 'phone' | 'unknown', userInput: string}) => {
    const {type} = props;
    const [loading, setLoading] = useState(true);
    const [cd, setCD] = useState(60000)
    const [time] = useCountDown(cd)
    const getCode = () => {
        if (type === 'email'){
            setLoading(true)
            IOC.user.getCheckCodeByEmail(props.userInput)
            .then((val)=>{
                setCD(val.data.cd);
            })
            .catch((err)=>console.log(err))
            .finally(()=>setLoading(false));
        }
        if (type === 'phone'){
            setLoading(true)
            IOC.user.getCheckCodeByPhone(props.userInput)
            .then((val)=>{
                setCD(val.data.cd);
            })
            .finally(()=>setLoading(false));
        }
    }
    useEffect(()=>{
        if (time === '0'){
            setLoading(false);
        }
    },[time])
    return (
        <Button onClick={getCode} isDisabled={loading} size="lg" className="flex gap-2 flex-grow-0 flex-shrink-0 basis-auto px-2 w-32 break-words">
            {
                loading ? <CountDown cd={cd} /> : '发送验证码'
            }
        </Button>
    )
}

export default CheckCode;