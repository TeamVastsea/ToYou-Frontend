'use client'

import { useCountDown } from "../hooks"

const CountDown = (
    props: {cd: number}
) => {
    const [time] = useCountDown(props.cd);
    return (
        <span>{time}秒后重新获取</span>
    )
}

export default CountDown;