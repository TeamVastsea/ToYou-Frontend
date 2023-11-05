'use client'

import {Button} from "@nextui-org/button";
import {ChangeEvent, ReactNode, useRef} from "react";

export default function Uploader(prop: UploaderProps) {
    const inputRef = useRef<any>(null);

    return (
        <div>
            <input type={"file"} style={{display: "none"}} ref={inputRef} onChange={(e) => {
                prop.onChange(e);
            }}/>
            <Button onClick={() => {
                if (inputRef == null) return;
                inputRef.current.click();
            }}>{prop.label}</Button>
        </div>
    )
}

export type UploaderProps = {
    label: ReactNode,
    onChange: (e: ChangeEvent<HTMLInputElement>) => any,
}
