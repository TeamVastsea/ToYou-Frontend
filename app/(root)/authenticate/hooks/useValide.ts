import { useCallback, useEffect, useMemo, useState } from "react"
import { PageType } from "../page";
import { z,ZodError, ZodIssue } from 'zod';
import { useUpdate, useUpdateEffect } from "ahooks";

const validateEmail = (val: string) => val.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/i);
const validatePhone = (val: string) => val.match(/^1[3-9]\d{9}$/i);
export const useAccountDiscriminator = (account: string) => {
    const [valide, setValide] = useState({phone: !!validatePhone(account), email: !!validateEmail(account)})
    useMemo(()=>{
        setValide(
            {phone: !!validatePhone(account), email: !!validateEmail(account)}
        )
    }, [account]);
    return valide;
}
const schema = {
    'wait-check': z.object({
        policyState: z.boolean().refine((v) => v, {message: '需要同意隐私策略'}),
        account: z.string().refine(v => {
            return validateEmail(v) || validatePhone(v)
        }, {message: '账号需要是邮箱或手机号'})
    }),
    'login': z.object({
        account: z.string().nonempty({message: '账号不能为空'}),
        password: z.string().nonempty({message: '密码不能为空'}),
        policyState: z.boolean().refine((v) => v, {message: '需要同意隐私策略'})
    }),
    'register': z.object({
        policyState: z.boolean().refine((v) => v, {message: '需要同意隐私策略'}),
        account: z.string().nonempty({message: '账号不能为空'}),
        password: z.string().nonempty({message: '密码不能为空'}),
        checkCode: z.string().nonempty({message: '验证码不能为空'}),
        passwordRobustness: z.boolean().array().refine((states) => states.every(s => s)),
        isPhone: z.boolean().refine((v) => v, {message: '注册需要使用手机号'}),
        userName: z.string().refine((v) => /^[\w.\-_a-zA-Z\u4e00-\u9fa5]+$/gm.test(v) && v.length >= 2, {'message': '用户名只能包含字母、汉字、数字和连接号(-)、下划线(_)、句点(.)且至少两位'})
    })
}


export const useValide = (
    pageType: PageType,
    props: Partial<ValidePrpos>,
) => {
    const [valide, setValide] = useState(false);
    const [errors, setErrors] = useState<ZodIssue[]>();
    const valideData = ()=>{
        if (pageType !== 'register'){
            const schemaValideRes = schema[pageType].safeParse(props);
            if (!schemaValideRes.success){
                setErrors(schemaValideRes.error.errors)
            }
            setValide(schemaValideRes.success);
            return;
        }
        if (pageType === 'register'){
            const schemaRes = schema['register'].safeParse(props)
            setValide(schemaRes.success && (props.password === props.confirmPassword));
            if (!schemaRes.success){
                setErrors(schemaRes.error.errors)
            }
            return;
        }
    };
    return {
        valide,errors,
        setValide,setErrors,
        valideData
    }
}

export interface ValidePrpos {
    policyState: boolean,
    password: string,
    confirmPassword: string,
    checkCode: string,
    passwordRobustness: boolean[],
    pageType: PageType,
    isEmail: boolean,
    isPhone: boolean,
    account: string,
    accountExists: boolean
    userName: string
}