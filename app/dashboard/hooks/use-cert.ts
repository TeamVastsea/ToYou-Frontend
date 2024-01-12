import { Message } from "@/components/message";
import IOC from "@/providers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CertInitProps {
    next: ()=>void;
    certName: string;
    certId: string;
    setCertName:  Dispatch<SetStateAction<string>>
    setCertId:  Dispatch<SetStateAction<string>>
}

export const useCertInit = (
    certId: string,
    setCertId: Dispatch<SetStateAction<string>>,
    next: ()=>void
) => {
    const [certName, setCertName] = useState('');
    const [certNo, setCertNo] = useState('');
    const [loading, setLoading] = useState(false);
    const onClick = () => {
        if (!certName.length){
            Message.error('姓名不能为空');
            return;
        }
        if (!certNo.length){
            Message.error('身份证号不能为空')
            return;
        }
        setLoading(true);
        IOC.certify.initialize({
            identity_param:{
                certName: certName,
                certNo: certNo
            }
        })
        .then(({data})=>{
            setCertId(data.certifyId)
            next()
        })
        .finally(()=>setLoading(false));
    }
    return {
        certNo,
        certName,
        loading,
        setCertNo,
        setCertName,
        setLoading,
        onClick
    }
}

export const useCertVerify = (certId: string) => {
    const [certUrl, setCertUrl] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        if (certId){
            IOC.certify.start({certifyId: certId})
            .then(({data}) => {
                setCertUrl(data.certifyUrl);
            })
        }
    }, [certId])
    const onClick = () => {
        setLoading(true)
        return IOC.certify.queryCertifyResult(certId)
        .catch((reason) => {
            Message.error(reason);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    return {
        certUrl,
        loading,
        setCertUrl,
        setLoading,
        onClick
    }
}

const useCert = () => {
    const [step, setStep] = useState(0);
    const addStep = () => setStep(step+1);
    const prev = () => setStep(step-1);
    const [certId, setCertId] = useState('');
    const certInitHook = useCertInit(certId, setCertId, addStep);
    const certVerifyHook = useCertVerify(certId);
    return {
        certInitHook,
        certVerifyHook,
        step,
        setStep,
        addStep,
        prev
    }
}

export default useCert;