import {useEffect, useState} from "react";

export function useCountDown(ms: number): [number, () => void, () => void, () => void] {
    const [time, setTime] = useState(ms);
    const [isRunning, setIsRunning] = useState(false);
    useEffect(() => {
        if (isRunning && time > 0) {
            const timerId = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
            return () => {
                clearTimeout(timerId);
            };
        } else {
            setIsRunning(false);
        }
    }, [isRunning, time]);
    const start = () => {
        setIsRunning(true)
    }
    const pause = () => {
        setIsRunning(false);
    }
    const reset = () => {
        setTime(ms);
        setIsRunning(false);
    }
    return [time, start, pause, reset];
}
