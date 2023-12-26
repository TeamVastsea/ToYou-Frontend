import {useEffect, useState} from "react";
import {PageType} from "../page";

export const useButtonMessage = (pageType: PageType, initMessage: string) => {
    const [buttonMessage, setButtonMessage] = useState(initMessage);
    useEffect(() => {
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
    props: {
        policyState: boolean,
        userName: string,
        password: string,
        confirmPassword: string,
        checkCode: string,
        valide: boolean,
        passwordRobustness: boolean[],
        pageType: PageType,
        isEmail: boolean,
        isPhone: boolean,
        account: string
    },
) => {
    const {
        policyState,
        pageType,
        userName,
        password,
        confirmPassword,
        checkCode,
        valide,
        passwordRobustness,
        isEmail,
        isPhone,
        account
    } = props;
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        if (pageType === 'wait-check') {
            setDisabled(
                !policyState || account.length === 0
            )
        }
        if (pageType === 'login') {
            setDisabled(!policyState || password.length === 0 || account.length === 0);
        }
        if (pageType === 'register') {
            setDisabled(
                !(
                    policyState && password === confirmPassword && valide && checkCode.length > 0 && passwordRobustness.every((v) => v) && isPhone
                )
            )
        }
    }, [checkCode, confirmPassword, isEmail, isPhone, pageType, password, passwordRobustness, policyState, valide, userName, account])
    return {disabled, setDisabled};
}


export const useButton = (props: {
    policyState: boolean,
    userName: string,
    password: string,
    confirmPassword: string,
    checkCode: string,
    valide: boolean,
    passwordRobustness: boolean[],
    pageType: PageType,
    isEmail: boolean,
    isPhone: boolean,
    account: string
}) => {
    const {disabled} = useDisabled(props);
    const [color, setColor] = useState<"default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>(disabled ? 'default' : 'primary');
    const {buttonMessage} = useButtonMessage(props.pageType, '下一步')
    useEffect(() => {
        setColor(disabled ? 'default' : 'primary')
    }, [disabled]);
    return {color, disabled, buttonMessage};
}
