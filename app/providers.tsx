"use client";

import * as React from "react";
import { useEffect } from 'react';
import {NextUIProvider} from "@nextui-org/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import { IsLoggedIn, UpdateSetLoggedInHook } from "@/interface/hooks";
import { redirect, useRouter, usePathname } from "next/navigation";

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