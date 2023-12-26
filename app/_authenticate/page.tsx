'use client'

import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React, {useEffect, useMemo, useState} from "react";
import {Input} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import {Message} from "@/components/message";
import {useRouter} from "next/navigation";
import {SetLoggedInState} from "@/interface/hooks";
import {UserAPI} from "@/interface/userAPI";
import IOC from "@/providers";
import {useButton, useIsEmail, useIsPhone, useType} from "./hooks";
import Password from "@/components/password";
import PasswordRobustnessList from "./components/password-robustness-list";
import CheckCode from "./components/check-code";

export type Colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
export type PageType = 'wait-check' | 'login' | 'register'

const Login = (
    props: {
        password: string;
        setPassword: (val: string) => void
    }
) => {
    return (
        <>
            <Input
                key="password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                style={{width: 300}}
                value={props.password}
                onValueChange={props.setPassword}
            />
        </>
    )
}

const Register = (
    props: {
        type: 'email' | 'phone' | 'unknown';
        userInput: string;
        code: string;
        userName: string;
        password: string;
        confirmPassword: string;
        passwordRobustness: boolean[];
        valide: boolean;
        setCode: (val: string) => void;
        setPassword: (val: string) => void,
        setUsername: (val: string) => void,
        setConfirmPassword: (val: string) => void,
    }
) => {
    const {
        code,
        userName,
        password,
        confirmPassword,
        userInput,
        valide,
        setCode,
        setPassword,
        setUsername,
        setConfirmPassword
    } = props;
    const [visible, setVisible] = useState(props.passwordRobustness.every(v => v));
    useEffect(() => {
        setVisible(props.passwordRobustness.every(v => v));
    }, [props.passwordRobustness])
    useEffect(() => {
        if (!visible) {
            setConfirmPassword('');
        }
    }, [setConfirmPassword, visible])
    return (
        <div className="space-y-5">
            <div className="flex gap-2 items-center">
                <Input
                    key={"code"}
                    value={code}
                    onValueChange={setCode}
                    type="text"
                    label="验证码"
                    placeholder="请输入验证码"
                    maxLength={6}

                />
                <CheckCode type={props.type} userInput={userInput}/>
            </div>
            <Input
                isClearable
                key="username"
                placeholder="请输入用户名"
                label="用户名"
                value={userName}
                onValueChange={setUsername}
                isInvalid={!valide}
                errorMessage={!valide && '用户名只能包含字母、汉字、数字和连接号(-)、下划线(_)、句点(.)'}
            />
            <div className="flex flex-col space-y-3 gap-2">
                <Password
                    key="password"
                    label="密码"
                    placeholder="请输入密码"
                    value={password}
                    onValueChange={setPassword}
                />
                <PasswordRobustnessList active={props.passwordRobustness}/>
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
    );
};

export default function Page() {
    const [userInput, setUserInput] = useState('');
    const [pageType, setPageType] = useState<PageType>('wait-check');
    const [policyState, setPolicyState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [valide, setValide] = useState(false);
    const [accountExists, setAccountExists] = useState(false)
    useEffect(() => {
        setValide(/^[\w.\-_a-zA-Z\u4e00-\u9fa5]+$/gm.test(userName) && userName.length >= 2);
    }, [userName]);
    const [passwordRobustness, setPasswordRobustness] = useState(new Array(6).fill(false));
    const isPhone = useIsPhone(userInput);
    const isEmail = useIsEmail(userInput);
    const {
        color, disabled, buttonMessage
    } = useButton({
        policyState,
        userName,
        password,
        confirmPassword,
        checkCode: code,
        valide,
        passwordRobustness,
        isPhone,
        pageType,
        isEmail,
        account: userInput
    });
    const fns = useMemo(() => {
        return [
            (val: string) => val.length >= 8,
            (val: string) => /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]/.test(val),
            (val: string) => val.length <= 30
        ]
    }, [])

    const router = useRouter();

    const [type] = useType(isPhone, isEmail)
    useEffect(() => {
        setPasswordRobustness(
            [...fns.map(fn => fn(password))]
        )
    }, [password, fns])

    const handleClick = () => {
        const login = () => {
            if (!isEmail && !isPhone) {
                Message.error("请输入邮箱或手机号")
            }
            setLoading(true);
            UserAPI.login(userInput, password)
                .then((r) => {
                    let [state, text] = r;
                    if (state) {
                        Message.success("登录成功");
                        SetLoggedInState(true);
                        router.push("/dashboard");
                    } else {
                        Message.error(text);
                    }
                })
        }
        const register = () => {
            if (!passwordRobustness.every(val => val)) {
                Message.error('密码不符合规范')
                return;
            }
            if (password != confirmPassword) {
                Message.error("密码输入不一致")
                return;
            }
            setLoading(true);
            IOC.user.createUser({
                phone: type === 'phone' ? userInput : '',
                password,
                username: userName,
                code
            })
                .then((
                    {data: [status, message]}
                ) => {
                    if (status) {
                        Message.success('注册成功, 请登录');
                        setPageType('login');
                        setPassword('');
                        return;
                    }
                    Message.error(message)
                })
                .finally(() => setLoading(false));
        }
        const waitCheck = () => {
            if (!isEmail && !isPhone) {
                Message.error("请输入邮箱或手机号")
                setLoading(false);
                return;
            }
            setLoading(true);
            if (isEmail) {
                IOC.user.checkEmail(userInput)
                .then(()=>{
                    setPageType('login')
                })
                .catch(()=>{
                    if (isEmail){
                        setAccountExists(true)
                        return;
                    }
                    setPageType('register')
                })
                .finally(()=>setLoading(false))
            }
            if (isPhone) {
                IOC.user.checkPhone(userInput)
                    .then(r => setPageType(r ? 'login' : 'register'))
                    .finally(() => setLoading(false))
            }
        }
        return {
            login,
            register,
            'wait-check': waitCheck
        }
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <div className="space-y-5">
                        <Input
                            isClearable
                            label={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                            placeholder={pageType !== 'register' ? '请输入邮箱或手机号' : '请输入手机号'}
                            key={"emailOrPhone"}
                            isInvalid={
                                pageType === 'login' ? isEmail || isPhone :
                                    pageType === 'register' ? isPhone : true
                            }
                            errorMessage={
                                pageType === 'login' ? !isEmail && !isPhone && ('请输入手机或邮箱') :
                                    pageType === 'register' ? !isPhone && ('请输入手机号') : null
                            }
                            type="text"
                            value={userInput}
                            onValueChange={setUserInput}
                            style={{width: 300}}
                        />
                        {
                            pageType !== 'wait-check' && (
                                pageType === 'login' ? <Login password={password} setPassword={setPassword}/> :
                                    <Register
                                        type={type} userInput={userInput} valide={valide}
                                        passwordRobustness={passwordRobustness}
                                        code={code} userName={userName} password={password}
                                        confirmPassword={confirmPassword}
                                        setPassword={setPassword} setConfirmPassword={setConfirmPassword} setCode={setCode}
                                        setUsername={setUsername}/>
                            )
                        }
                        <Checkbox
                            isSelected={policyState}
                            onValueChange={setPolicyState}>登录或注册即代表同意服务条款
                        </Checkbox>
                    </div>
                </CardBody>
                <CardFooter className="px-5">
                    <Button
                        isLoading={loading}
                        disabled={
                            disabled
                        }
                        color={
                            color
                        }
                        onClick={handleClick()[pageType]}
                    >
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
