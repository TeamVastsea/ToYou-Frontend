'use client'

import { Button, Card, CardBody, CardFooter, Checkbox, Input } from '@nextui-org/react';
import { KeyboardEvent, useEffect, useState} from 'react';
import { useAccountDiscriminator, useValide } from './hooks/useValide';
import { useButton } from './hooks/useButton';
import IOC from '@/providers';
import { useRouter } from 'next/navigation';
import { useUpdateEffect } from 'ahooks';
import { accountAtom } from '@/app/store';
import { useAtom } from 'jotai';

export type Colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
export type PageType = 'wait-check' | 'login' | 'register'

export default function Page(){
    const [account, setAccount] = useAtom(accountAtom)
    const [pageType, setPageType] = useState<PageType>('wait-check');
    const [policy, setPolicy] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const {phone, email} = useAccountDiscriminator(account)
    const {valide, valideData} = useValide(pageType, { account, policyState: policy, isPhone: phone, isEmail: email });
    const {color, disabled, loading, setLoading, buttonMessage} = useButton({pageType, valide });
    const router = useRouter();
    useEffect(()=>{
        valideData()
    }, [ account, policy, phone, email, pageType ]);
    const onChangeAccount = (account: string) => {
        setAccount(account);
        setPageType("wait-check");
    }

    const accountCheck = () => {
        setLoading(true);
        setPageType('login')
    }
    const onEnter = (e:KeyboardEvent) => {
        if (!disabled && e.code.toLowerCase().includes('enter')){
            e.preventDefault();
            accountCheck()
        }
    }
    useUpdateEffect(()=>{
        if (pageType !== 'wait-check'){
            router.push(`/authenticate/${pageType}`);
        }
    }, [pageType]);
    return (
        <form>
            <Card className='w-full' onKeyDown={onEnter}>
                <CardBody>
                    <div className='space-y-5'>
                        <div className='space-y-2'>
                            <Input
                                label={'请输入邮箱或手机号'}
                                placeholder={'请输入邮箱或手机号'}
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
                        <Checkbox isSelected={policy} onValueChange={setPolicy}>
                            登录或注册即代表同意服务条款
                        </Checkbox>
                    </div>
                </CardBody>
                <CardFooter className='px-5'>
                    <Button color={color} isDisabled={disabled} onClick={accountCheck} isLoading={loading} type='submit'>
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
