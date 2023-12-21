import {Input} from "@nextui-org/react";
import {CloseFilledIcon, EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import React, {useEffect, useState} from "react";

export interface PasswordProps {
    label: string;
    placeholder?: string;
    value?: string;
    isInValide?: boolean;
    errorMessage?: React.ReactNode;
    isClearable?: boolean;
    onValueChange?: (val: string) => void;
}

export default function Password(
    props: PasswordProps,
    key: string
) {
    const {label, placeholder, value, isInValide, errorMessage, isClearable, onValueChange} = props
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => setVisible(!visible);
    const [clearShow, setClearShow] = useState(Boolean(value?.length));
    const clear = () => {
        onValueChange && onValueChange('');
    };
    const endContent = () => {
        return (
            <div className="flex items-center gap-2">
                {
                    clearShow && (
                        <button onClick={clear}>
                            <CloseFilledIcon className=" opacity-70"/>
                        </button>
                    )
                }
                <button onClick={toggleVisible}>
                    {visible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                    )}
                </button>
            </div>
        )
    }
    useEffect(() => {
        setClearShow(Boolean(value?.length));
    }, [value])
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
