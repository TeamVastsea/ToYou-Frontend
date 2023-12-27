'use client'

import { Input } from "@nextui-org/react";
import CheckCode from "./check-code";
import { useEffect, useState } from "react";
import Password from "@/components/password";
import PasswordRobustnessList from "./password-robustness-list";

export default function Register({
    account,
    code,
    password,
    confirmPassword,
    passwordRobustness,
    userName,
    setCode,
    setPassword,
    setAccount,
    setConfirmPassword,
    setUserName
}: RegisterProps){
    const [userNameInValide, setUserNameValide] = useState(false);
    const [visible, setVisible] = useState(passwordRobustness.every(v => v));
    useEffect(()=>{
        setUserNameValide(
            !/^[\w.\-_a-zA-Z\u4e00-\u9fa5]+$/gm.test(userName) && userName.length < 2
        )
    }, [userName])
    useEffect(()=>{
        setVisible(
            passwordRobustness.every(v => v)
        )
    }, [passwordRobustness])
    return (
        <div className="space-y-5">
            <div className="w-full flex max-[320px]:flex-wrap items-center gap-2">
                <Input
                    value={code}
                    onValueChange={setCode}
                    type="text"
                    label="验证码"
                    placeholder="请输入验证码"
                    maxLength={6}
                    className="w-36 flex-auto"
                />
                <CheckCode type="phone" account={account} className="w-fit max-[320px]:w-full" />
            </div>
            <Input
                isClearable
                placeholder="请输入用户名"
                label="用户名"
                value={userName}
                onValueChange={setUserName}
                isInvalid={(userNameInValide && userName.length !== 0)}
                errorMessage={(userNameInValide && userName.length !== 0) && '用户名只能包含字母、汉字、数字和连接号(-)、下划线(_)、句点(.)'}
            />
            <div className="flex flex-col space-y-3 gap-2">
                <Password
                    label="密码"
                    placeholder="请输入密码"
                    value={password}
                    onValueChange={setPassword}
                />
                <PasswordRobustnessList active={passwordRobustness}/>
                {
                    visible &&
                    (
                        <Password
                            key="confirm-password"
                            placeholder="请确认密码"
                            label="确认密码"
                            value={confirmPassword}
                            errorMessage={password !== confirmPassword && confirmPassword.length > 0 && '两次输入的密码需要相同'}
                            onValueChange={setConfirmPassword}
                        />
                    )
                }
            </div>
        </div>
    )
}

export interface RegisterProps {
    account: string;
    code: string;
    password: string;
    confirmPassword: string;
    passwordRobustness: boolean[];
    valide: boolean;
    userName: string;
    setCode: (val: string) => void;
    setPassword: (val: string) => void,
    setAccount: (val: string) => void,
    setConfirmPassword: (val: string) => void,
    setUserName: (val:string) => void;
}
