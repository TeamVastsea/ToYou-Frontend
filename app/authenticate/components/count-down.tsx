'use client'

import { useEffect, useRef, useState } from "react";
import { useCountDown } from "../hooks"

const CountDown = (
    props: {countDown: number, onFinish: () => void}
) => {
    const [cd, setCD] = useState(
        Number((props.countDown / 1000).toFixed())
    );
    const [time, start] = useCountDown(cd);
    useEffect(()=>{
        start();
    },[])
    useEffect(()=>{
        if (time === 0){
            props.onFinish();
        }
    },[time, props])
    return (
        <span>{time}秒后重新获取</span>
    )
}

export default CountDown;