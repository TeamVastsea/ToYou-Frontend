'use client'

import cookie from "react-cookies";

export let SetLoggedInState: any = null;
export let IsLoggedIn = cookie.load("token") != undefined;

export function UpdateSetLoggedInHook(hook: any) {
    SetLoggedInState = (loggedIn: boolean) => {
        hook(loggedIn);
        IsLoggedIn = loggedIn;
    };
}