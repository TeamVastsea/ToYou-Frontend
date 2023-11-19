"use client";

import * as React from "react";
import { useEffect } from 'react';
import {NextUIProvider} from "@nextui-org/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import { IsLoggedIn, UpdateSetLoggedInHook } from "@/interface/hooks";
import { redirect, useRouter, usePathname } from "next/navigation";
import { getDefaultStore, useAtom } from "jotai";
import { token } from "@/store";

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
    const [value, setToken] = useAtom(token);

    useEffect(()=>{
        if (!whiteList.includes(pathName) && !value){
            redirect('/authenticate');
        }
    }, [setToken,value, whiteList, pathName])

    // if (!value && !whiteList.includes(pathName)){
    //     return null;
    // }
    return (
        <>
            {children}
        </>
    )
}