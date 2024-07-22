'use client'

import { accountAtom } from "@/app/store";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Input, Link } from "@nextui-org/react";
import { useAtom } from "jotai";
import Register from "../components/register";
import { useEffect, useMemo, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useMount, useUpdateEffect } from "ahooks";
import { useButton } from "../hooks/useButton";
import { useValide } from "../hooks/useValide";
import { IoChevronBackSharp } from "react-icons/io5";
import IOC from "@/providers";
import { Message } from "@/components/message";
import { useRouter } from "next/navigation";

const isEmail = (val: string): boolean => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gim.test(val);
const isPhone = (val: string): boolean => /^[0-9]{7,32}$/gim.test(val);

export default function RegisterPage(){
    const [account, setAccount] = useAtom(accountAtom);
    
    const {
        code,
        password,
        confirmPassword,
        passwordRobustness,
        userName,
        setCode,
        setPassword,
        setConfirmPassword,
        setUsername,
        setRobustness,
    } = useRegister();
    const [policy, setPolicy] = useState(false);
    const accountType = useMemo(() => isPhone(account) ? 'phone' : isEmail(account) ? 'email' : '', [account]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {valide, valideData, errors} = useValide('register', {
        password,
        confirmPassword,
        checkCode: code,
        passwordRobustness,
        pageType: 'register',
        isEmail: accountType === 'email',
        isPhone: accountType === 'phone',
        account,
        accountExists: false,
        userName,
        policyState: policy
    })
    useEffect(()=>{
        valideData()
    }, [account, policy, password, confirmPassword, code, userName, passwordRobustness]);
    const {buttonMessage, color, disabled} = useButton({
        pageType: 'register',
        valide,
    })
    const fns = useMemo(() => {
        return [
            (val: string) => val.length > 5,
            (val: string) => /[A-Z]/.test(val),
            (val: string) => /[a-z]/.test(val),
            (val: string) => /[0-9]/.test(val),
            (val: string) => /\W/.test(val),
            (val: string) => val.length < 20
        ]
    }, [])
    useMount(()=>{
        setRobustness(
            Array.from({length: fns.length}, ()=>false)
        )
    })
    useUpdateEffect(()=>{
        setRobustness(
            [...fns.map(fn => fn(password))]
        )
    },[password,fns, setRobustness])

    const reg = () => {
        if (errors && errors.length){
            const [err] = errors;
            Message.error(err.message);
            return;
        }
        IOC.user.createUser({
            username: userName,
            phone: account,
            password,
            code
        })
        .then(({data}) => data)
        .then(() => {
            Message.success('注册成功, 请登录');
            router.replace('/authenticate/login');
            setPassword('');
        })
        .finally(() => setLoading(false));
    }

    return (
        <form>
            <Card className='w-full'>
                <CardHeader>
                    <div>
                        <Link href="/authenticate">
                            <IoChevronBackSharp className="w-6 h-6" />
                        </Link>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="space-y-5">
                        <Input
                            label={'请输入手机号'}
                            placeholder={'请输入手机号'}
                            isClearable
                            value={account}
                            onValueChange={setAccount}
                            className='w-full'
                        />
                        <Register
                            code={code}
                            account={account}
                            password={password}
                            confirmPassword={confirmPassword}
                            userName={userName}
                            setCode={setCode}
                            setPassword={setPassword}
                            setConfirmPassword={setConfirmPassword}
                            setUserName={setUsername}
                            passwordRobustness={passwordRobustness}
                        />
                        <Checkbox isSelected={policy} onValueChange={setPolicy}>
                            登录或注册即代表同意服务条款
                        </Checkbox>
                    </div>
                </CardBody>
                <CardFooter className='px-5'>
                    <Button 
                        color={color}
                        isDisabled={disabled}
                        onClick={reg}
                        isLoading={loading}
                    >
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}