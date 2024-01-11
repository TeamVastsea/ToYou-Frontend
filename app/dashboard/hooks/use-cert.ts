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
        setLoading(true);
        IOC.certify.initialize({
            identity_param:{
                cert_name: certName,
                cert_no: certNo
            }
        })
        .then(({data})=>{
            setCertId(data.certify_id)
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
            IOC.certify.start({certify_id: certId})
            .then(({data}) => {
                setCertUrl(data.certify_url);
            })
        }
    }, [certId])
    const onClick = () => {
        setLoading(true)
        IOC.certify.queryCertifyResult(certId)
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
    const [certId, setCertId] = useState('');
    const certInitHook = useCertInit(certId, setCertId, addStep);
    const certVerifyHook = useCertVerify(certId);
    return {
        certInitHook,
        certVerifyHook,
        step,
        setStep,
        addStep,
    }
}

export default useCert;