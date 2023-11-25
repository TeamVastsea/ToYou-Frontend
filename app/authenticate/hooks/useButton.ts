import { SetStateAction, useEffect, useState } from "react";
import { Colors, PageType } from "../page";

export const useButtonMessage = (pageType: PageType, initMessage: string) => {
    const [buttonMessage, setButtonMessage] = useState(initMessage);
    useEffect(()=>{
        let msg = '下一步';
        switch (pageType) {
            case 'login':
                msg = '登录'
                break;
            case 'register':
                msg = '注册'
                break;
        }
        setButtonMessage(msg);
    }, [pageType,]);
    return {
        buttonMessage,
        setButtonMessage
    }
}
export const useDisabled = (
    policyState: boolean,
    userName: string,
    password: string,
    confirmPassword: string,
    checkCode: string,
    valide: boolean
):[boolean,React.Dispatch<SetStateAction<boolean>>] => {
    const [disabled, setDisabled] = useState<boolean>(
        !policyState ||
        (userName.length > 30 || userName.length < 2) ||
        password !== confirmPassword
    )
    useEffect(()=>{
        setDisabled(!policyState ||
        (password !== confirmPassword) || !valide || 
        checkCode.length !== 0) 
    }, [policyState, userName.length, password, confirmPassword, valide, checkCode])
    return [disabled, setDisabled]
}
export const useButtonColor = (
    disabled: boolean
) => {
    const [buttonColor, setButtonColor] = useState<Colors>('default');
    useEffect(()=>{
        if (
            !disabled
        ){
            setButtonColor('primary')
            return;
        }
        setButtonColor('default')
    }, [disabled])
    return {
        buttonColor,
        setButtonColor
    }
}