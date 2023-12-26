'use client'

import { Button, Card, CardBody, CardFooter, Checkbox, Input } from '@nextui-org/react';
import {useEffect, useMemo, useState} from 'react';
import { useAccountDiscriminator, useValide } from './hooks/useValide';
import { useButton } from './hooks/useButton';
import IOC from '@/providers';
import { Login } from './components/login';
import Register from './components/register';

export type Colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
export type PageType = 'wait-check' | 'login' | 'register'

export default function Page(){
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');    
    const [accountExists, setAccountExists] = useState(false);
    const [code, setCode] = useState('');
    const [passwordRobustness, setPasswordRobustness] = useState(new Array(6).fill(false));
    const [userName, setUserName] = useState('');

    const [pageType, setPageType] = useState<PageType>('wait-check');
    const [policy, setPolicy] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const {phone, email} = useAccountDiscriminator(account)
    const {valide, errors, valideData} = useValide(pageType, {
        account,
        policyState: policy,
        password,
        confirmPassword,
        checkCode: code,
        userName,
        passwordRobustness,
        isPhone: phone,
        isEmail: email,        
    });
    const {color, disabled, loading, setLoading} = useButton({pageType, valide });
    
    const fns = useMemo(() => {
        return [
            (val: string) => val.length >= 8,
            (val: string) => /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]/.test(val),
            (val: string) => val.length <= 30
        ]
    }, [])
    useEffect(()=>{
        if (errors){
            console.log(errors.issues);
        }
    }, [errors])
    useEffect(()=>{
        if (pageType !== 'wait-check'){
            if (account.length === 0){
                setPageType('wait-check');
            }
        }
    }, [pageType, account])
    useEffect(()=>{
        valideData()
    }, [
        account,
        policy,
        password,
        confirmPassword,
        code,
        userName,
        passwordRobustness,
        phone,
        email,
        pageType
    ]);
    useEffect(()=>{
        setPasswordRobustness(
            [...fns.map(fn => fn(password))]
        )
    }, [password, fns])
    const invoke = () => {
        
        const checkAccount = () => {
            setLoading(true);
            if (email){
                IOC.user.checkEmail(account)
                    .then((exists) => {
                        setShowErr(!exists)
                    })
                    .finally(() => setLoading(false));
            }
            if (phone){
                IOC.user.checkPhone(account)
                .then((exists) => {
                    if (!exists){
                        setPageType('register')
                        return;
                    }
                    setPageType('login')
                })
                .finally(()=>{
                    setLoading(false);
                })
            }
        }
        const login = () => {
            console.log(account, password);
        }
        const reg = () => {
            
        }
        const obj:Record<PageType, ()=>void> = {
            'login': login,
            'register': reg,
            'wait-check': checkAccount
        }
        return obj[pageType]
    }
    return (
        <Card className='max-w-[300px] w-full'>
            <CardBody>
                <div className='space-y-5'>
                    <div className='space-y-2'>
                        <Input
                            label={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                            placeholder={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                            isClearable
                            value={account}
                            onValueChange={setAccount}
                            className='w-full'
                        />
                        {
                            (showErr && email) && 
                            <div className='px-3'>
                                <span className='text-red-500 text-sm'>账号不存在, 请使用手机注册</span>
                            </div>
                        }
                    </div>
                    {
                        pageType !== 'wait-check' ? pageType === 'login' ?
                            <Login password={password} setPassword={setPassword} /> :
                            pageType ===  'register' ?
                            <Register 
                                account={account}
                                code={code}
                                password={password}
                                confirmPassword={confirmPassword}
                                passwordRobustness={passwordRobustness}
                                valide={false}
                                userName={userName} 
                                setCode={setCode}
                                setPassword={setPassword}
                                setAccount={setAccount}
                                setConfirmPassword={setConfirmPassword}
                                setUserName={setUserName} /> : null : null
                    }
                    <Checkbox isSelected={policy} onValueChange={setPolicy}>
                        登录或注册即代表同意服务条款
                    </Checkbox>
                </div>
            </CardBody>
            <CardFooter className='px-5'>
                <Button color={color} onClick={invoke()}>
                    下一步
                </Button>
            </CardFooter>
        </Card>
    )
}