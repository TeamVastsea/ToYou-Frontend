import {useMemo} from "react"

export const useIsEmail = (userInput: string) => {
    const validateEmail = (val: string) => val.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/i);
    return useMemo(() => {
        if (!userInput) {
            return false;
        }
        return !!validateEmail(userInput);
    }, [userInput]);
}

export const useIsPhone = (userInput: string) => {
    const validatePhone = (val: string) => val.match(/^1[3-9]\d{9}$/i);
    return useMemo(() => {
        if (!userInput) {
            return false;
        }
        return !!validatePhone(userInput);
    }, [userInput]);
}
