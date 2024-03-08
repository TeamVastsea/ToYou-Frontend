'use client'

import { Button, Card, CardBody, CardFooter, Checkbox, Input } from '@nextui-org/react';
import { KeyboardEvent, useEffect, useMemo, useState} from 'react';
import { useAccountDiscriminator, useValide } from './hooks/useValide';
import { useButton } from './hooks/useButton';
import IOC from '@/providers';
import { Login } from './components/login';
import Register from './components/register';
import { Message } from '@/components/message';
import { useRouter } from 'next/navigation';
import { SetLoggedInState } from '@/interface/hooks';
import { UserAPI } from '@/interface/userAPI';
import { useDebounceFn } from 'ahooks';

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
    const {color, disabled, loading, setLoading, buttonMessage} = useButton({pageType, valide });
    const router = useRouter();
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
    useEffect(()=>{
        if (pageType !== 'wait-check' && account.length === 0){
            setPageType('wait-check');
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
    const checkAccountExistsByEmail = () => {
        return IOC.user.checkEmail(account)
            .then((exists:boolean) => exists)
            .catch(() => false);
    }
    const checkAccountExistsByPhone = () => {
        return IOC.user.checkPhone(account)
            .then((exists:boolean) => exists)
            .catch(() => false);
    }
    const checkAccountExists = useDebounceFn(()=>{
        if (email){
            checkAccountExistsByEmail()
                .then((exists) => {
                    setShowErr(!exists)
                })
                .finally(() => setLoading(false));
        }
    }, {wait: 1000})
    useEffect(()=>{
        checkAccountExists.run();
    }, [account]);
    const invoke = () => {
        const checkAccount = () => {
            setLoading(true);
            if (email){
                checkAccountExistsByEmail()
                    .then((exists) => {
                        setShowErr(!exists)
                    })
                    .finally(() => setLoading(false));
            }
            if (phone){
                checkAccountExistsByPhone()
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
            setLoading(true)
            UserAPI.login(account, password)
            .then((r) => {
                const [state, text] = r;
                if (state) {
                    Message.success("登录成功");
                    SetLoggedInState(true);
                    router.push("/dashboard");
                } else {
                    Message.error(text);
                    setLoading(false)
                }
            })
        }
        const reg = () => {
            setLoading(true)
            if (phone){
                IOC.user.createUser({
                    phone: account,
                    password,
                    username: userName,
                    code
                })
                    .then(() => {
                            Message.success('注册成功, 请登录');
                            setPageType('login');
                            setPassword('');
                            return;
                    })
                    .finally(() => setLoading(false));
            }
        }
        const obj:Record<PageType, ()=>void> = {
            'login': login,
            'register': reg,
            'wait-check': checkAccount
        }
        return obj[pageType]
    }
    const onEnter = (e:KeyboardEvent) => {
        if (!disabled && e.code.toLowerCase().includes('enter')){
            e.preventDefault();
            invoke()();
        }
    }

    const onChangeAccount = (account: string) => {
        setAccount(account);
        setPageType("wait-check");
    }
    return (
        <form>
            <Card className='max-w-md w-full' onKeyDown={onEnter}>
                <CardBody>
                    <div className='space-y-5'>
                        <div className='space-y-2'>
                            <Input
                                label={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                                placeholder={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                                isClearable
                                value={account}
                                onValueChange={onChangeAccount}
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
                        <Checkbox isSelected={policy} onValueChange={setPolicy} onKeyDown={onEnter}>
                            登录或注册即代表同意服务条款
                        </Checkbox>
                    </div>
                </CardBody>
                <CardFooter className='px-5'>
                    <Button color={color} isDisabled={disabled} onClick={invoke()} isLoading={loading} type='submit'>
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
