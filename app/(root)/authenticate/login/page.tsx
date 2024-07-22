'use client';
import { useState } from "react";
import { Login } from "../components/login";
import { useAtom } from "jotai";
import { accountAtom } from "@/app/store";
import { Button, Card, CardBody, CardFooter, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import IOC from "@/providers";
import { UserAPI } from "@/interface/userAPI";
import { Message } from "@/components/message";
import { SetLoggedInState } from "@/interface/hooks";
import { useRouter } from "next/navigation";
export default function LoginPage(){
    const [password, setPassword] = useState('');
    const [account, setAccount] = useAtom(accountAtom);
    const [policy, setPolicy] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const login = () => {
        setLoading(true);
        UserAPI.login(account, password)
        .then((
            [state, text]
        )=>{
            if (state){
                Message.success('登陆成功');
                SetLoggedInState(true);
                router.push('/dashboard')
            } else {
                Message.success(text);
            }
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    return (
        <form>
            <Card className='w-full'>
                <CardBody>
                    <div className='space-y-5'>
                        <div className='space-y-5'>
                            <Input
                                label={'请输入手机号'}
                                placeholder={'请输入手机号'}
                                isClearable
                                value={account}
                                onValueChange={setAccount}
                                className='w-full'
                            />
                            <Login password={password} setPassword={setPassword} />
                            <div className="space-x-2">
                                <Link href={'/authenticate/register'} className="text-primary-500 text-sm">
                                    点击注册
                                </Link>
                            </div>
                        </div>
                        <Checkbox isSelected={policy} onValueChange={setPolicy}>
                            登录或注册即代表同意服务条款
                        </Checkbox>
                    </div>
                </CardBody>
                <CardFooter className='px-5'>
                    <Button 
                        color={(account.length && policy) ? 'primary' : 'default'}
                        isDisabled={!policy}
                        onClick={login}
                        isLoading={loading}
                        type='submit'
                    >
                        登录
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}