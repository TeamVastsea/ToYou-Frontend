'use client'
import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {ReactNode, useState} from "react";
import {Input} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";

function getAdditionalInput(state: string): ReactNode {
    if (state == "login") {
        return (
            <Input key={"password"} type="password" label="密码" placeholder="Password" style={{width: 300}}/>
        );
    } else if (state == "register") {
        return (
            <div className="flex space-x-3" style={{ width: "auto", display: "flex" }}>
                <Input key={"code"} isRequired type="text" label="验证码" placeholder="Code" style={{ height: "auto", flex: 3 }} endContent={
                    <Button size={"sm"} style={{position: "relative", top: -7.5}}>发送验证码</Button>
                }/>
            </div>

        );
    } else {
        return (
            <></>
        );
    }
}

export default function Page() {
    let setEmail = useState("");
    let [buttonColor, setButtonColor] = useState("default");
    let [buttonDisable, setButtonDisable] = useState(true);
    let [state, setState] = useState("email");

    let [emailInvalid, setEmailInvalid] = useState(true);
    let [emailErrorMessage, setEmailErrorMessage] = useState("请输入邮箱");

    return (
        <>
            <Card>
                <CardBody>
                    <div className="space-y-5">
                        <Input key={"email"} isInvalid={emailInvalid} errorMessage={emailErrorMessage} type="email" label="邮箱" placeholder="Email" style={{width: 300}} onChange={
                            (e) => {
                                let value = e.target.value;

                                if (value.length == 0) {
                                    setEmailInvalid(true);
                                    setEmailErrorMessage("请输入邮箱");
                                } else if (!value.match(/^(.[a-zA-Z0-9_-]+)+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/i)) {
                                    setEmailInvalid(true);
                                    setEmailErrorMessage("邮箱格式不正确");
                                } else {
                                    setEmailInvalid(false);
                                    setEmailErrorMessage("");
                                }

                                setEmail(value);
                                setState("email");
                            }
                        }/>
                        {getAdditionalInput(state)}
                        <Checkbox onChange={(e) => {
                            let checked = e.target.checked;
                            setButtonDisable(!checked);
                            setButtonColor(checked ? "primary": "default");
                        }}>登录或注册即代表同意服务条款</Checkbox>
                    </div>
                </CardBody>
                <CardFooter>
                    <Button style={{position: "relative", left: 7}} color={buttonColor} disabled={buttonDisable} onClick={
                        () => {
                            setState("register");
                        }
                    }>
                        {state == "email" ? "下一步" : state == "login" ? "登录" : "注册"}
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}