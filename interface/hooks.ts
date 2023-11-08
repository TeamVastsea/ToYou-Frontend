export var SetLoggedInState: any = null;

export function UpdateSetLoggedInHook(hook: any) {
    SetLoggedInState = hook;
}