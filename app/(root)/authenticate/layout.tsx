'use client'
import React from "react";
import { useMount } from "ahooks";
import { useRouter } from "next/navigation";

export default function AuthenticateLayout({children}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    useMount(()=>{
        router.prefetch('/authenticate/login')
        router.prefetch('/authenticate/register')
    })
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-md w-full text-center justify-center">
                {children}
            </div>
        </section>
    );
}
