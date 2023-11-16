'use client'

import cookie from "react-cookies";

export var SetLoggedInState: any = null;
export var IsLoggedIn: boolean = cookie.load("token") != undefined;

export function UpdateSetLoggedInHook(hook: any) {
    SetLoggedInState = (loggedIn: boolean) => {
        hook(loggedIn);
        IsLoggedIn = loggedIn;
    };
}