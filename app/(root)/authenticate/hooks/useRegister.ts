import { useState } from "react"

export const useRegister = (
) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRobustness, setRobustness] = useState<boolean[]>([]);
    const [userName, setUsername] = useState('');
    return {
        code,
        setCode,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        passwordRobustness,
        setRobustness,
        userName,
        setUsername
    }
}