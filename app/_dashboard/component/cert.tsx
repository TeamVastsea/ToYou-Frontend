'use client'

import {Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, useModal} from "@nextui-org/react"
import {Component, Dispatch, SetStateAction, useEffect, useMemo, useState} from "react"
import {QRCodeSVG} from 'qrcode.react';
import useCert from "../hooks/use-cert";
import {verify} from '../../store';
import {useAtom} from "jotai";
import {Message} from "@/components/message";

interface CertInitProps {
    prev: () => void
    onClick: () => void;
    certName: string;
    certNo: string;
    setCertName: Dispatch<SetStateAction<string>>
    setCertNo: Dispatch<SetStateAction<string>>
}

const CertInit = (props: CertInitProps) => {
    const {certNo, certName, setCertNo, setCertName} = props;
    return (
        <>
            <Input label="真实姓名" onValueChange={setCertName} value={certName} isRequired/>
            <Input label="身份证号" onValueChange={setCertNo} value={certNo} isRequired/>
            <Button className="w-fit" onClick={props.onClick}>下一步</Button>
        </>
    )
}

const CertVerify = (props: { cert_url: string, query: () => Promise<unknown>, prev: () => void }) => {
    const {cert_url} = props;
    const [qrUrl, setQrUrl] = useState(cert_url);
    const [isVerify, setVerify] = useAtom(verify)
    const queryVerifyState = () => {
        props.query()
            .then(() => {
                setVerify(true);
            })
            .catch(() => {
                setVerify(false);
                Message.error('实名认证失败')
            })
    }
    return (
        <>
            <QRCodeSVG value={cert_url} size={320} bgColor="#000" fgColor="#fff" includeMargin={false}/>
            <span>请使用支付宝扫描二维码</span>
            <div className="w-fit space-x-4">
                <Button className="w-fit" onClick={props.prev}>上一步</Button>
                <Button onClick={queryVerifyState}>我已扫描</Button>
            </div>
        </>
    )
}

export default function Cert() {
    const {isOpen, onOpenChange, onOpen} = useDisclosure();
    const {step, addStep, prev, certInitHook, certVerifyHook} = useCert();
    const CertSteps = (step: number) => {
        const steps = [
            <CertInit key='init' {...certInitHook} prev={prev}/>,
            <CertVerify key='verify' cert_url={certVerifyHook.certUrl} query={certVerifyHook.onClick} prev={prev}/>
        ];
        return steps[step];
    }
    useEffect(() => {
        onOpen();
    }, [])
    return (
        <Modal backdrop="blur" isOpen={isOpen} hideCloseButton>
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
