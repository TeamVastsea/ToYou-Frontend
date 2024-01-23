'use client'

import Password from "@/components/password";

export function Login({password, setPassword}: LoginProps){

    return (
        <Password label="密码" placeholder="请输入密码" value={password} onValueChange={setPassword} />
    )
}

export interface LoginProps {
    password: string;
    setPassword: (val: string)=>void
}