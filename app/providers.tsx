"use client";

import * as React from "react";
import { useEffect } from 'react';
import {NextUIProvider} from "@nextui-org/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import { IsLoggedIn, UpdateSetLoggedInHook } from "@/interface/hooks";
import { redirect, useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useToasterStore } from "react-hot-toast";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export interface AuthProvider {
    children: React.ReactNode,
    whiteList: string[]
}

export function Providers({children, themeProps}: ProvidersProps) {
    return (
        <NextUIProvider>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
    );
}
export function AuthProvider({children, whiteList}: AuthProvider) {
    const pathName = usePathname();
    useEffect(()=>{
        if (!whiteList.includes(pathName) && !IsLoggedIn){
            redirect('/authenticate')
        }
    }, [pathName, whiteList])
    if (!IsLoggedIn && !whiteList.includes(pathName)){
        return <></>;
    }
    return (
        <>
            {children}
        </>
    )
}
export const ToastProvider = ({children} : {children: React.ReactNode}) => {
    const { toasts } = useToasterStore();
    
    const TOAST_LIMIT = 2
    
    useEffect(() => {
      toasts
        .filter((t) => t.visible)
        .filter((_, i) => i >= TOAST_LIMIT)
        .forEach((t) => toast.remove(t.id));
    }, [toasts]);
    return (
      <>
        {children}
      </>
    )
}