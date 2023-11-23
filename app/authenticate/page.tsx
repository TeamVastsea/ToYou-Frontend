'use client'

import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React, {ReactNode, useEffect, useMemo, useReducer, useState} from "react";
import {Input} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import {Message} from "@/components/message";
import {useRouter} from "next/navigation";
import {UserModel} from "@/interface/model/user";
import {SetLoggedInState} from "@/interface/hooks";
import {UserAPI} from "@/interface/userAPI";
import { IoCloseSharp } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import Password from "@/components/password";

type Colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
type PageType = 'wait-check' | 'login' | 'register'

const useButtonMessage = (pageType: PageType, initMessage: string) => {
    const [buttonMessage, setButtonMessage] = useState(initMessage);
    useEffect(()=>{
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

const useButtonColor = (policyState: boolean) => {
    const [buttonColor, setButtonColor] = useState<Colors>('default');
    useEffect(()=>{
        if (policyState){
            setButtonColor('primary')
            return;
        }
        setButtonColor('default')
    }, [policyState])
    return {
        buttonColor,
        setButtonColor
    }
}

const Login = (
    props: {
        password: string;
        setPassword: (val: string)=>void
    }
) => {
    return (
     <>
         <Input
             key="password"
             type="password"
             label="密码"
             placeholder="密码"
             style={{width: 300}}
             value={props.password}
             onValueChange={props.setPassword}
         />
     </>
    )
}

const PasswordRobustnessList = (props: {active: boolean[]}) => {
    const labels = [
        {
            key: 'min',
            label: '至少8位'
        },
        {
            key: 'number',
            label: '至少一个数字'
        },
        {
            key: 'uppercase',
            label: '至少一个大写字符'
        },
        {
            key: 'lowercase',
            label: '至少一个小写字符'
        },
        {
            key: 'special',
            label: '至少包含一个特殊字符'
        },
        {
            key: 'max',
            label: '至多30位'
        }
    ]
    return (
        <ul className="w-full">
            {
                labels.map(({label, key}, idx)=>{
                    return (
                        <li
                            key={key}
                            className={`
                                flex items-center transition
                                ${props.active[idx] ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`
                            }
                        >
                            {
                                props.active[idx] ?  <IoCheckmark className="inline text-xl" /> : <IoCloseSharp className="inline text-xl" />
                            }
                            <span>{label}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
}

const Register = (
    props: {
        code: string;
        userName: string,
        password: string,
        confirmPassword: string,
        passwordRobustness: boolean[]
        setCode: (val: string)=>void;
        setPassword: (val:string)=>void,
        setUsername: (val:string)=>void,
        setConfirmPassword: (val:string)=>void,
    }
) => {
    const {code, userName,password,confirmPassword,setCode,setPassword,setUsername,setConfirmPassword} = props;

    return (
        <div className="space-y-5">
            <div className="flex space-x-3" style={{width: "auto", display: "flex"}}>
                <Input key={"code"} value={code} onValueChange={setCode} type="text" label="验证码" placeholder="验证码" style={{height: "auto", flex: 3}} />
            </div>
            <Input key="username" placeholder="用户名" label="用户名" value={userName} onValueChange={setUsername}/>
            <div className="flex flex-col space-y-3 gap-2">
                <Password
                    key="password"
                    label="密码"
                    placeholder="密码"
                    value={password}
                    onValueChange={setPassword}
                    />
                {props.passwordRobustness.some(v => !v) && <PasswordRobustnessList active={props.passwordRobustness} />}
                {
                    props.passwordRobustness.every(v => v) && 
                    (
                        <Password
                            key="confirm-password"
                            placeholder="确认密码"
                            label="确认密码"
                            value={confirmPassword}
                            onValueChange={setConfirmPassword}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default function Page() {
    const [email, setEmail] = useState('');
    const [pageType, setPageType] = useState<PageType>('register');
    const {buttonMessage} = useButtonMessage(pageType, '下一步');
    const [policyState, setPolicyState] = useState(false);
    const {buttonColor} = useButtonColor(policyState);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [passwordRobustness, setPasswordRobustness] = useState(new Array(6).fill(false));
    const fns = useMemo(()=>{
        return [
            (val: string) => val.length >= 8,
            (val: string) => /[0-9]{1}/.test(val),
            (val: string) => /[A-Z]{1}/.test(val),
            (val: string) => /[a-z]{1}/.test(val),
            (val: string) => /[!@#$%^&*()\-=_+{}\[\]|\\:;"'<>,.?\/]{1}/.test(val),
            (val: string)=> val.length <= 30
        ]
    }, [])

    const router = useRouter();
    const validateEmail  = (val: string)=>val.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/i);
    const isEmail = useMemo(()=>{
        if (!email){
            return false;
        }
        return validateEmail(email) ? true : false;
    }, [email]);
    useEffect(()=>{
        setPasswordRobustness(
            [...fns.map(fn => fn(password))]
        )
    },[password, fns])

    const handleClick = () => {
        const login = () => {
            if (!isEmail){
                Message.error("请输入邮箱")
            }
            UserAPI.login(email, password)
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
            .finally(()=>setLoading(false))
        }
        const register = ()=>{
            if (!passwordRobustness.every(val => val)){
                Message.error('密码不符合规范')
                return;
            }
            if (password != confirmPassword) {
                Message.error("密码输入不一致")
                return;
            }
            UserAPI.creatUser(email, password, userName, code)
            .then(r => {
                let [status, message] = r;
                if (status) {
                    Message.success("注册成功，请登录");
                    setPageType("login");
                    setEmail("");
                    setUsername("");
                    setPassword("");
                } else {
                    Message.error(message);
                }
            })
            .finally(() => setLoading(false))
        }
        const waitCheck = () => {
            if (!isEmail){
                Message.error("请输入邮箱")
                setLoading(false);
                return;
            }
            UserAPI.checkEmail(email)
            .then(r => {
                setPageType(r ? "login" : "register")
                if (!r) {
                    Message.message("验证码已发送")
                }
            })
            .finally(()=>setLoading(false))
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
                            label="Email"
                            placeholder="email"
                            key={"email"}
                            isInvalid={isEmail}
                            errorMessage={!isEmail && (email.length ? "邮箱格式不正确" : "请输入邮箱")}
                            type="email"
                            value={email}
                            onValueChange={setEmail}
                            style={{width: 300}}
                        />
                        {
                            pageType !== 'wait-check' && (
                                pageType === 'login' ? <Login password={password} setPassword={setPassword} /> :
                                <Register
                                    passwordRobustness={passwordRobustness}
                                    code={code} userName={userName} password={password} confirmPassword={confirmPassword}
                                    setPassword={setPassword} setConfirmPassword={setConfirmPassword} setCode={setCode} setUsername={setUsername} />
                                )
                        }
                        <Checkbox isSelected={policyState} onValueChange={setPolicyState}>登录或注册即代表同意服务条款</Checkbox>
                    </div>
                </CardBody>
                <CardFooter className="px-5">
                    <Button
                        isLoading={loading}
                        disabled={!policyState}
                        color={buttonColor}
                        onClick={handleClick()[pageType]}
                    >
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
