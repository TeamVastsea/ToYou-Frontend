'use client'

import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, useModal } from "@nextui-org/react"
import { Component, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import {QRCodeSVG} from 'qrcode.react';
import useCert from "../hooks/use-cert";

interface CertInitProps {
    onClick: ()=>void;
    certName: string;
    certNo: string;
    setCertName:  Dispatch<SetStateAction<string>>
    setCertNo:  Dispatch<SetStateAction<string>>
}

const CertInit = (props: CertInitProps) => {
    const {certNo,certName,setCertNo,setCertName} = props;
    return (
        <>
            <Input label="真实姓名" onValueChange={setCertName} value={certName} isRequired />
            <Input label="身份证号" onValueChange={setCertNo} value={certNo} isRequired />
            <Button className="w-fit mx-auto" onClick={props.onClick}>下一步</Button>
        </>
    )
}

const CertVerify = (props: {cert_url: string}) => {
    const {cert_url} = props;
    const [qrUrl, setQrUrl] = useState(cert_url);
    return (
        <>
            <QRCodeSVG value={qrUrl} size={320} bgColor="#000" fgColor="#fff" includeMargin={false} />
            <span>请使用支付宝扫描二维码</span>
            <Button>我已扫描</Button>
        </>
    )
}

export default function Cert(){
    const {isOpen, onOpenChange, onOpen} = useDisclosure();
    const {step, addStep, certInitHook, certVerifyHook} = useCert();
    const CertSteps = (step: number) => {
        const steps = [
            <CertInit key='init' {...certInitHook} />,
            <CertVerify key='verify' cert_url={certVerifyHook.certUrl} />
        ];
        return steps[step];
    }    
    useEffect(()=>{
        onOpen();
    },[])
    return (
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader>
                            实名认证
                        </ModalHeader>
                        <ModalBody>
                            <div className="w-full flex flex-col justify-center items-center justify-items-center content-center text-center gap-2">
                                {CertSteps(step)}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}