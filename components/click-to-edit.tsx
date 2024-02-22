import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {FaCheck, FaCheckDouble} from "react-icons/fa6";
import {Message} from "@/components/message";

export default function ClickToEdit(props: ClickToEditProps) {
    let [value, setValue] = useState(props.default);
    let [verifyValue, setVerifyValue] = useState("");
    let [isEdit, setEdit] = useState(false);
    let [verify, setVerify] = useState(false);


    return (
        <p>
            {
                isEdit ?
                    <p className="flex gap-x-1">
                        <Input value={value} onValueChange={setValue}
                               className="max-w-fit"/>
                        <Button onClick={async () => {
                            await props.onComplete(value);
                            setEdit(false);
                            if (props.verify) {
                                setVerify(true);
                            }
                        }} isIconOnly color={props.verify ? "warning" : "primary"}>
                            <FaCheck/>
                        </Button>
                    </p>
                    : verify ?
                        <p className="flex gap-x-1">
                            <Input value={verifyValue} onValueChange={setVerifyValue}
                                   className="max-w-fit" placeholder={"输入验证码"}/>
                            <Button onClick={() => {
                                if (props.onVerify) {
                                    let result = props.onVerify(verifyValue);
                                    if (result) {
                                        setVerify(false);
                                        setVerifyValue("");
                                    }
                                } else {
                                    Message.warning("无法验证");
                                    setEdit(true);
                                    setVerify(false);
                                }
                            }} isIconOnly color={"success"}>
                                <FaCheckDouble/>
                            </Button>
                        </p> :
                        <Button variant={"light"} onClick={() => {
                            setEdit(true);
                        }}>
                            {value}
                        </Button>
            }

        </p>
    )
}

export type ClickToEditProps = {
    default: string,
    onComplete: (value: string) => void | Promise<void>,
    verify?: boolean,
    onVerify?: (value: string) => boolean,
}
