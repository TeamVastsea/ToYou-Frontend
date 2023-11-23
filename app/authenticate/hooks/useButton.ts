import { useEffect, useState } from "react";
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

export const useButtonColor = (policyState: boolean) => {
    const [buttonColor, setButtonColor] = useState<Colors>('default');
    useEffect(()=>{
        if (policyState){
            setButtonColor('primary')
            return;
        }
        setButtonColor('default')
    }, [policyState])
    return {
        buttonColor,
        setButtonColor
    }
}