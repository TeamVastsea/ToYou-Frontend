'use client'

import {useState} from "react";
import IOC from "@/providers";
import {Button} from "@nextui-org/react";
import CountDown from "./count-down";

const CheckCode = (props: { type: 'email' | 'phone' | 'unknown', userInput: string }) => {
    const {type} = props;
    const [cd, setCD] = useState(0)
    const onCountdownFinish = () => {
        setCD(0)
    }
    const getCode = () => {
        if (type === 'email') {
            IOC.user.getCheckCodeByEmail(props.userInput)
                .then((val) => {
                    setCD(val.data.cd + 1);
                })
                .catch((err) => {
                    console.log(err);
                    setCD(60 * 1000);
                })
        }
        if (type === 'phone') {
            IOC.user.getCheckCodeByPhone(props.userInput)
                .then((val) => {
                    setCD(val.data.cd + 1);
                    console.log(val.data.cd)
                })
                .catch(() => {
                    setCD(60 * 1000);
                })
        }
    }
    return (
        <Button onClick={getCode} isDisabled={cd > 0} size="lg"
                className="flex gap-2 flex-grow-0 flex-shrink-0 basis-auto px-2 w-32 break-words">
            {
                cd > 0 ? <CountDown countDown={cd} onFinish={onCountdownFinish}/> : '发送验证码'
            }
        </Button>
    )
}

export default CheckCode;
