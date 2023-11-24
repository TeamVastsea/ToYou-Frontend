import { Input } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import dynamic from "next/dynamic";
import React, { useState } from "react";
export interface PasswordProps {
    label: string;
    placeholder: string;
    value?: string;
    isInValide?: boolean;
    errorMessage?: React.ReactNode;
    onValueChange?: (val:string)=>void;
}

export default function Password(
    props: PasswordProps,
    key: string
){
    const {label, placeholder, value,isInValide, errorMessage, onValueChange} = props
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => setVisible(!visible);
    const endContent = () => {
        return (<button onClick={toggleVisible}>
            {visible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
        </button>)
    }
    return (
        <Input
            key={key}
            type={visible ? 'text' : 'password'}
            label={label}
            placeholder={placeholder}
            value={value}
            isInvalid={isInValide}
            errorMessage={errorMessage}
            onValueChange={onValueChange}
            endContent={endContent()}
        />
    )
}