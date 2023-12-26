import React, {SetStateAction, useEffect, useState} from "react"

export const useType = (
    isPhone: boolean,
    isEmail: boolean
): ['email' | 'phone' | 'unknown', React.Dispatch<SetStateAction<'email' | 'phone' | 'unknown'>>] => {
    const [type, setType] = useState<'email' | 'phone' | 'unknown'>('email')
    useEffect(() => {
        if (!isPhone && !isEmail) {
            setType('unknown');
            return;
        }
        if (isPhone) {
            setType('phone');
            return;
        }
        if (isEmail) {
            setType('email');
            return;
        }
    }, [isPhone, isEmail]);
    return [type, setType]
}
