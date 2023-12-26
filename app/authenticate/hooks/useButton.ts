import {useEffect, useState} from 'react';
import { Colors, PageType } from '../page';
import IOC from '@/providers';

const useButtonMessage = (type: PageType, initMessage:string) => {
    const [buttonMessage, setButtonMessage] = useState(initMessage);
    useEffect(() => {
        let msg = '下一步';
        switch (type) {
            case 'login':
                msg = '登录'
                break;
            case 'register':
                msg = '注册'
                break;
        }
        setButtonMessage(msg);
    }, [type]);
    return {
        buttonMessage,
        setButtonMessage
    }
}
const useDisabled = (
    valide: boolean
) => {
    const [disabled, setDisabled] = useState(!valide);
    useEffect(()=>{
        setDisabled(!valide);
    }, [valide]);
    return {disabled, setDisabled}
}
interface UseEventProps {
    setLoading: (value: boolean)=>void;
    account: string;
    phone: string;
    password: string;
    email: string;
    pageType: PageType;
    setPageType: (pageType: PageType)=>void;
    setShowErr: (value: boolean)=>void;
}

export const useButton = ({
    pageType,
    valide
}:Partial<UseButtonProps>) => {
    const {buttonMessage} = useButtonMessage(pageType!, '下一步');
    const {disabled} = useDisabled(valide!)
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState<Colors>(disabled ? 'default' : 'primary');
    useEffect(()=>{
        setColor(disabled ? 'default' : 'primary');
    }, [disabled, pageType]);
    return {buttonMessage, disabled, color, loading, setLoading, setColor}
}

export interface UseButtonProps {
    policy: boolean;
    account: string;
    password: string;
    confirmPassword: string;
    checkCode: string;
    passwordRobustness: boolean[];
    isEmail: boolean,
    isPhone: boolean,
    pageType: PageType,
    accountExists: boolean,
    valide: boolean // from useValide
}